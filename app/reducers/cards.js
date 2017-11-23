// @flow
import { toPairs, compact } from 'lodash';
import { createRoutine } from 'redux-saga-routines';
import { all, takeLatest, put, call, select } from 'redux-saga/effects';
import { Map, fromJS } from 'immutable';
import uuidv4 from 'uuid/v4';
import { remote } from 'electron';
import path from 'path';
import fs from 'fs-extra';

import type { IOEffect } from 'redux-saga/effects';

import { getPropertyByRuleMatchingAction } from './nlp';

type ActionType = {
  type: string,
  payload: any,
};

export type Card = {
  id: string,
  type: string, // mime type
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
function* saveCardToFs(id: string) {
  const card: ?Map<Card> = yield select(state => state.cards.get('cards').find(aCard => aCard.get('id') === id));
  if (!card) {
    return;
  }
  const saverID: ?string = yield select(state => state.config.get('config').get('saver'));
  if (!saverID) {
    // use default saver
    const notePath = path.join(remote.app.getPath('appData'), 'PantsControl', 'notes', id, `${id}.json`);
    yield call(fs.outputJson, notePath, card.toJS());
  } else {
    fetch(`http://localhost:3000/lambdav1/${saverID}/aaa`, {
      body: JSON.stringify({
        card: card.toJS(),
        id,
      }),
    });
  }
}

function* saveCard(action) {
  yield put(saveCardToMemoryAction.request(action.payload));
  yield call(saveCardToFs, action.payload.id);
}

export const loadCardFromFsAction = createRoutine('loadCardFromFs');
function* loadCardFromFs() {
  const loaderID: ?string = yield select(state => state.config.get('config').get('loader'));
  let cards: Array<Card> = [];
  if (!loaderID) {
    // use default loader
    const noteRootPath = path.join(remote.app.getPath('appData'), 'PantsControl', 'notes');
    yield call(fs.ensureDir, noteRootPath);
    const noteDirNames: string[] = yield call(fs.readdir, noteRootPath);
    // eslint-disable-next-line no-restricted-syntax
    for (const noteID of noteDirNames) {
      try {
        const cardJSON = yield call(fs.readJson, path.join(noteRootPath, noteID, `${noteID}.json`));
        cards.push(cardJSON);
      } catch (error) {
        console.error(`${noteID} doesn't exist?`);
      }
    }
  } else {
    const result = yield call(fetch, `http://localhost:3000/lambdav1/${loaderID}/aaa`);
    cards = result.data;
  }
  yield put(loadCardFromFsAction.success(cards));
}

export const addNewCardAction = createRoutine('addNewCard');
function* addNewCard() {
  const id = uuidv4();
  yield put(addNewCardAction.request({ id }));
}

export default function* cardSaga(): Generator<IOEffect, void, any> {
  yield all([
    takeLatest(addNewCardAction.TRIGGER, addNewCard),
    takeLatest(saveCardToMemoryAction.TRIGGER, saveCard),
    takeLatest(loadCardFromFsAction.TRIGGER, loadCardFromFs),
  ]);
}

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
      const { id, content } = action.payload;
      return state.set(
        'cards',
        // add a new card
        state.get('cards').unshift(
          fromJS({
            id,
            type: 'text/plain',
            tags: [],
            content: content || '',
            focused: true,
          }),
        ),
      );
    }
    case saveCardToMemoryAction.REQUEST: {
      const thisCardIndex = state.get('cards').findIndex(aCard => aCard.get('id') === action.payload.id);
      return state.setIn(['cards', thisCardIndex, 'content'], JSON.stringify(action.payload.content));
    }
    case loadCardFromFsAction.SUCCESS: {
      const cards: Array<Card> = action.payload;
      return state.set('cards', fromJS(cards));
    }
    case getPropertyByRuleMatchingAction.SUCCESS: {
      const thisCardIndex = state.get('cards').findIndex(aCard => aCard.get('id') === action.payload.id);
      return state.setIn(['cards', thisCardIndex, 'tags'], fromJS(toPairs(action.payload.tags)));
    }
    default:
      return state;
  }
}
