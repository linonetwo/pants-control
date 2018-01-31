// @flow
import { toPairs, compact } from 'lodash';
import { createRoutine } from 'redux-saga-routines';
import { all, takeLatest, put, call, select } from 'redux-saga/effects';
import { Map, fromJS } from 'immutable';
import uuidv4 from 'uuid/v4';
import { remote } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import getJSON from 'async-get-json';

import type { IOEffect } from 'redux-saga/effects';

import { getPropertyByRuleMatchingAction } from './nlp';

type ActionType = {
  type: string,
  payload: any,
};

export type Note = {
  id: string,
  type: string, // mime type
  tags: string[][], // [[key, value], ...]
  content: string, // stringified EditorState
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
  const card: ?Map<Note> = yield select(state => state.cards.getIn(['entities', 'notes', 'byID', id]));
  if (!card) {
    return;
  }
  const noteSaverID: string = yield select(
    // eslint-disable-next-line no-confusing-arrow
    state =>
      state.config.hasIn(['config', 'noteSaver', 'noteSaverID'])
        ? state.config.getIn(['config', 'noteSaver', 'noteSaverID'])
        : '');
  if (!noteSaverID) {
    // use default saver
    console.log('use default saver');
    const notePath = path.join(remote.app.getPath('appData'), 'PantsControl', 'notes', id, `${id}.json`);
    yield call(fs.outputJson, notePath, card.toJS());
  } else {
    console.log(`Using saver ${noteSaverID}`);
    fetch(`http://localhost:6012/lambdav1/${noteSaverID}/aaa`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
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
  const noteRootPath = path.join(remote.app.getPath('appData'), 'PantsControl', 'notes');
  yield call(fs.ensureDir, noteRootPath);
  let notes: Array<Note> = [];
  let noteIDs: string[] = [];

  const [noteLoaderID, criticalNotes]: [string, string[]] = yield select(state => [
    state.config.hasIn(['config', 'noteLoader', 'noteLoaderID'])
      ? state.config.getIn(['config', 'noteLoader', 'noteLoaderID'])
      : '',
    state.config.hasIn(['config', 'noteLoader', 'criticalNotes'])
      ? state.config.getIn(['config', 'noteLoader', 'criticalNotes']).toArray()
      : [],
  ]);
  if (!noteLoaderID) {
    // use default loader
    noteIDs = yield call(fs.readdir, noteRootPath);
    // eslint-disable-next-line no-restricted-syntax
    for (const noteID of noteIDs) {
      try {
        const cardJSON = yield call(fs.readJson, path.join(noteRootPath, noteID, `${noteID}.json`));
        notes.push(cardJSON);
      } catch (error) {
        console.error(`${noteID} doesn't exist?`);
      }
    }
  } else {
    // eslint-disable-next-line no-restricted-syntax
    for (const noteID of criticalNotes) {
      try {
        const cardJSON = yield call(fs.readJson, path.join(noteRootPath, noteID, `${noteID}.json`));
        notes.push(cardJSON);
      } catch (error) {
        console.error(`${noteID} doesn't exist?`);
      }
    }
    yield put(loadCardFromFsAction.success({ notes, noteIDs: criticalNotes }));
    try {
      console.log(`Using loader note ${noteLoaderID}`);
      notes = yield call(getJSON, `http://localhost:6012/lambdav1/${noteLoaderID}/aaa`);
      noteIDs = notes.map(c => c.id);
    } catch (error) {
      console.error(error);
    }
  }
  yield put(loadCardFromFsAction.success({ notes, noteIDs }));
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

type NoteByID = {
  [id: string]: Note,
};
export type Notes = {
  byID: NoteByID,
  allIDs: Array<string>,
};
export type CardsInitialStateType = {
  entities: {
    notes: Notes,
  },
};

const cardsInitialState: Map<CardsInitialStateType> = fromJS({
  entities: {
    notes: { byID: {}, allIDs: [] },
  },
});

export function cardsReducer(
  state: Map<CardsInitialStateType> = cardsInitialState,
  action: ActionType,
): Map<CardsInitialStateType> {
  switch (action.type) {
    case addNewCardAction.REQUEST: {
      const { id, content } = action.payload;
      return state
        .setIn(
          ['entities', 'notes', 'byID', id],
          fromJS({
            id,
            type: 'text/plain',
            tags: [],
            content: content || '',
          }),
        )
        .updateIn(['entities', 'notes', 'allIDs'], allIDs => allIDs.unshift(id));
    }
    case saveCardToMemoryAction.REQUEST: {
      return state.setIn(
        ['entities', 'notes', 'byID', action.payload.id, 'content'],
        JSON.stringify(action.payload.content),
      );
    }
    case loadCardFromFsAction.SUCCESS: {
      const { notes, noteIDs }: { notes: Array<Note>, noteIDs: string[] } = action.payload;
      const noteByID: NoteByID = notes.reduce(
        (noteObject: NoteByID, aNote) => ({ ...noteObject, [aNote.id]: aNote }),
        {},
      );
      return state
        .setIn(['entities', 'notes', 'byID'], fromJS(noteByID))
        .setIn(['entities', 'notes', 'allIDs'], fromJS(noteIDs));
    }
    case getPropertyByRuleMatchingAction.SUCCESS:
      return state.setIn(
        ['entities', 'notes', 'byID', action.payload.id, 'tags'],
        fromJS(toPairs(action.payload.tags)),
      );

    default:
      return state;
  }
}
