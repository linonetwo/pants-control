// @flow
import Immutable, { type Immutable as ImmutableType } from 'seamless-immutable';
import { put, takeLatest, call } from 'redux-saga/effects';

import type { ActionType, KeyValue } from './types';

import { loadNote, saveNote, focusNote } from './actions/core';
import IPFSFileUploader from '../ipfs/IPFSFileUploader';
import IPFSFileGetter from '../ipfs/IPFSFileGetter';

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

/** 把一篇笔记 JS 对象保存到本地缓存和 IPFS 上，返回 id 和拿到的 hash */
function* saveNoteToMemoryAndIpfsSaga(action: ActionType) {
  try {
    const { note, id } = action.payload;
    const ipfs = yield IPFSFileUploader.create();
    yield call(ipfs.ready);
    const { hash } = yield call(ipfs.uploadObject, note);
    yield put(saveNote.success({ id, hash }));
  } catch (error) {
    yield put(saveNote.failure({ message: error.message }));
    console.error(error);
  }
}

function* loadNoteFromIpfsSaga(action: ActionType) {
  try {
    const { hash } = action.payload;
    const ipfs = yield IPFSFileGetter.create();
    const files = yield call(ipfs.getFile, hash);
    console.log('loadNoteFromIpfsSaga', files);
    yield put(loadNote.success({ id: hash, note: files[0] }));
  } catch (error) {
    yield put(loadNote.failure({ message: error.message }));
    console.error(error);
  }
}

export const noteSagas = [
  takeLatest(saveNote.TRIGGER, saveNoteToMemoryAndIpfsSaga),
  takeLatest(loadNote.TRIGGER, loadNoteFromIpfsSaga),
];

/** 内存中的笔记使用 ID 来追踪，IPFS 上的笔记用 hash 来追踪，当笔记被修改保存后 hash 会改变，而 ID 通过内存中的一个字典对应到 hash */
type NoteInitialStateType = {
  notes: { [id: string]: KeyValue },
  hashes: { [id: string]: string },
  ids: string[],
  currentNoteID: string,
};

const noteInitialState: ImmutableType<NoteInitialStateType> = Immutable({
  notes: {},
  ids: [],
  hashes: {},
  currentNoteID: '',
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
    //  保存到 IPFS 成功后，更新某个本地 id 对应的 hash
    case saveNote.SUCCESS:
      return state.setIn(['hashes', action.payload.id], action.payload.hash);
    case focusNote.TRIGGER:
      return state.set('currentNoteID', action.payload);

    default:
      return state;
  }
}
