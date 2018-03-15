/* eslint-disable new-cap */
// @flow
import { flow } from 'lodash';
import Immutable, { type Immutable as ImmutableType } from 'seamless-immutable';
import aesjs from 'aes-js';
import keypair from 'keypair';
import { createRoutine } from 'redux-saga-routines';
import { put, takeLatest } from 'redux-saga/effects';

import type { ActionType, KeyValue } from './types';
import { viewerRegister, viewerLogin } from './actions/core';

export const loadProfile = createRoutine('@core/loadProfile');

type ViewerInitialStateType = {
  profile: KeyValue,
};

const viewerInitialState: ImmutableType<ViewerInitialStateType> = Immutable({
  profile: {},
  viewerID: '',
});

const ctrCounter = 7;

export function* viewerRegisterSaga(action: ActionType) {
  try {
    const { name, password } = action.payload;

    const aesCtr = new aesjs.ModeOfOperation.ctr(password, new aesjs.Counter(ctrCounter));
    const { public: publicKey, private: privateKey } = keypair();
    const encrypt = flow([aesjs.utils.utf8.toBytes, aesCtr.encrypt, aesjs.utils.hex.fromBytes]);
    const encryptedPrivateKeyHex = encrypt(privateKey);

    const newProfile = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name,
      description: 'Lead Engineer on Uport',
      publicKey,
    };
    yield put(viewerRegister.success());
  } catch (error) {
    yield put(viewerRegister.failure({ message: error.message }));
  }
}

export function* loadViewerSecret(action: ActionType) {
  try {
    const { password } = action.payload;

    const aesCtr = new aesjs.ModeOfOperation.ctr(password, new aesjs.Counter(ctrCounter));
    const decrypt = flow([aesjs.utils.hex.toBytes, aesCtr.decrypt, aesjs.utils.utf8.fromBytes]);

    const privateKey = decrypt();
    yield put(viewerLogin.success({ privateKey }));
  } catch (error) {
    yield put(viewerLogin.failure({ message: error.message }));
  }
}

export const viewerSagas = [takeLatest(viewerRegister.TRIGGER, viewerRegisterSaga)];

export function viewerReducer(
  state: ImmutableType<ViewerInitialStateType> = viewerInitialState,
  action: ActionType,
): ImmutableType<ViewerInitialStateType> {
  switch (action.type) {
    case loadProfile.SUCCESS:
      (action.payload: KeyValue);
      return state.setIn('profile', action.payload);

    default:
      return state;
  }
}
