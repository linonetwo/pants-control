// @flow
import { toPairs, compact } from 'lodash';
import { createRoutine } from 'redux-saga-routines';
import { all, takeLatest, put, call, select } from 'redux-saga/effects';
import { Map, fromJS } from 'immutable';
import uuidv4 from 'uuid/v4';
import { remote } from 'electron';
import path from 'path';
import fs from 'fs-extra';

import { getPropertyByRuleMatchingAction } from './nlp';

type ActionType = {
  type: string,
  payload: any,
};

export type Card = {
  id: string,
  tags: string[][], // [[key, value], ...]
  content: string, // stringified EditorState
  focused: boolean, // focused card will parse stringified EditorState then you can edit it
};

//  █████╗ ██████╗ ██╗
// ██╔══██╗██╔══██╗██║
// ███████║██████╔╝██║
// ██╔══██║██╔═══╝ ██║
// ██║  ██║██║     ██║
// ╚═╝  ╚═╝╚═╝     ╚═╝

// ████████╗ █████╗ ███████╗██╗  ██╗
// ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
//    ██║   ███████║███████╗█████╔╝
//    ██║   ██╔══██║╚════██║██╔═██╗
//    ██║   ██║  ██║███████║██║  ██╗
//    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

export const saveCardToMemoryAction = createRoutine('saveCardToMemory');
export const saveCardToFsAction = createRoutine('saveCardToFs');
function* saveCardToFs(action) {
  const { card, id }: { card: Object, id: string } = action.payload;
  const loaderID: string = yield select(state => state.config.get('config').get('loader'));
  if (!loaderID) {
    // use default loader
    const notePath = path.join(remote.app.getPath('appData'), 'PantsControl', 'notes', id, `${id}.json`);
    yield call(fs.outputJson, notePath, card);
  } else {
    fetch(`http://localhost:3000/lambdav1/${loaderID}/aaa`, {
      body: JSON.stringify({
        card,
        id,
      }),
    });
  }
}

export const loadCardToMemoryAction = createRoutine('loadCardToMemory');
export const loadCardToFsAction = createRoutine('loadCardToFs');
function* loadCardToFs(action) {
  const loaderID: string = yield select(state => state.config.get('config').get('loader'));
  let cards: Array<Card> = [];
  if (!loaderID) {
    // use default loader
    const noteRootPath = path.join(remote.app.getPath('appData'), 'PantsControl', 'notes');
    yield call(fs.ensureDir, noteRootPath);
    const noteDirNames: string[] = yield call(fs.readdir, noteRootPath);
    for (const noteID of noteDirNames) {
      try {
        const cardJSON = yield call(fs.readJson, path.join(noteRootPath, noteID, `${noteID}.json`))
        cards.push(cardJSON);
      } catch (error) {
        console.error(`${noteID} doesn't exist?`)
      }
    }
  } else {
    const result = yield call(fetch, `http://localhost:3000/lambdav1/${loaderID}/aaa`);
    cards = result.data;
  }
  yield put(loadCardToMemoryAction.TRIGGER, cards);
}

export const addNewCardAction = createRoutine('addNewCard');
function* addNewCard() {
  const id = uuidv4();
  yield put(addNewCardAction.request({ id }));
}

yield all([
  takeLatest(addNewCardAction.TRIGGER, addNewCard),
  takeLatest(saveCardToFsAction.TRIGGER, saveCardToFs),
]);

// ███████╗████████╗ ██████╗ ██████╗ ███████╗
// ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
// ███████╗   ██║   ██║   ██║██████╔╝█████╗
// ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝
// ███████║   ██║   ╚██████╔╝██║  ██║███████╗
// ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝

export type CardsInitialStateType = {
  cards: Array<Card>,
};

const cardsInitialState: Map<CardsInitialStateType> = fromJS({
  cards: [],
});

export function cardsReducer(
  state: Map<CardsInitialStateType> = cardsInitialState,
  action: ActionType,
): Map<CardsInitialStateType> {
  switch (action.type) {
    case addNewCardAction.REQUEST: {
      const { id } = action.payload;
      return state.set(
        'cards',
        // add a new card
        state.get('cards').unshift(
          fromJS({
            id,
            tags: [],
            content: '',
            focused: true,
          }),
        ),
      );
    }
    case saveCardToMemoryAction.TRIGGER: {
      const thisCardIndex = state.get('cards').findIndex(aCard => aCard.get('id') === action.payload.id);
      return state.setIn(['cards', thisCardIndex, 'content'], action.payload.content);
    }
    case loadCardToMemoryAction.TRIGGER: {
      const cards: Array<Card> = action.payload;
      return state.set('cards', cards);
    }
    case getPropertyByRuleMatchingAction.SUCCESS: {
      const thisCardIndex = state.get('cards').findIndex(aCard => aCard.get('id') === action.payload.id);
      return state.setIn(['cards', thisCardIndex, 'tags'], fromJS(toPairs(action.payload.tags)));
    }
    default:
      return state;
  }
}
