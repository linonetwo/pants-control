// @flow
import Immutable, { type Immutable as ImmutableType } from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import getJSON from 'async-get-json';

import { initIPFS } from '../ipfs/ipfs';

import type { ActionType, KeyValue } from './types';

const ipfs = initIPFS();

async function saveNoteToFs(id: string, note: any, noteSaverID: string, noteHash: string) {
  if (!noteSaverID) {
    // should use default saver
    console.log('No saver note found.');
  } else {
    console.log(`Using saver ${noteSaverID}`);
    await fetch(`http://localhost:6012/lambdav1/${noteSaverID}?noteHash=${noteHash}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note,
        id,
      }),
    });
  }
}

async function loadNoteFromFs(id: string, noteLoaderID: string, noteHash: string) {
  if (!noteLoaderID) {
    // use default loader
    console.log('No loader note found.');
  } else {
    try {
      console.log(`Using loader note ${noteLoaderID}`);
      const note = await getJSON(`http://localhost:6012/lambdav1/${noteLoaderID}?id=${id}&noteHash=${noteHash}`);
      return note;
    } catch (error) {
      console.error(error);
    }
  }
}

async function executeNote(id: string, noteLoaderID: string) {
  if (!noteLoaderID) {
    // use default loader
    console.log('No loader note found.');
  } else {
    try {
      await fetch(`http://localhost:6012/lambdav1/${noteSaverID}/aaa`, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note,
          id,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export const loadNote = createRoutine('@core/loadNote');
export const saveNote = createRoutine('@core/saveNote');

type NoteInitialStateType = {
  notes: { [id: string]: KeyValue },
  ids: string[],
};

const noteInitialState: ImmutableType<NoteInitialStateType> = Immutable({
  notes: {},
  ids: [],
});

export function noteReducer(
  state: ImmutableType<NoteInitialStateType> = noteInitialState,
  action: ActionType,
): ImmutableType<NoteInitialStateType> {
  switch (action.type) {
    // 保存到内存和读取到内存，进行同样的操作
    case saveNote.TRIGGER:
    case loadNote.SUCCESS: {
      const { note, id } = action.payload;
      return state.setIn(['notes', id], note).set('ids', state.ids.concat([id]));
    }

    default:
      return state;
  }
}
