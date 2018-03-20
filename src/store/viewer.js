// @flow
import Immutable, { type Immutable as ImmutableType } from 'seamless-immutable';
import keypair from 'keypair';
import { put, takeLatest, call } from 'redux-saga/effects';

import type { ActionType, KeyValue } from './types';
import { viewerRegister, viewerLogin } from './actions/core';
import IPFSFileUploader from '../ipfs/IPFSFileUploader';
import IPFSFileGetter from '../ipfs/IPFSFileGetter';
import { saveStorage, loadStorage } from '../utils/nativeUtils';
import { encrypt, decrypt } from '../utils/crypto';

const getPrivateKeyStoreKey = (profileHash: string) => `${profileHash}-private`;

/** 创建用户公私钥和 profile，公钥放在 profile 里，私钥用密码加密后放在 localStorage 或者本地 */
export function* viewerRegisterSaga(action: ActionType) {
  try {
    const { name, password } = action.payload;
    const ipfs = new IPFSFileUploader();

    const { public: publicKey, private: privateKey } = keypair();
    const encryptedPrivateKeyHex = encrypt(password, privateKey);

    // prepare profile
    const newProfile = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name,
      description: 'Lead Engineer on Uport',
      publicKey,
    };
    // wait for node to be set up
    yield call(ipfs.ready);
    // Put profile to IPFS
    const { hash: profileHash } = yield call(ipfs.uploadObject, newProfile);
    if (profileHash) {
      // Put private key to localStorage
      yield call(saveStorage, getPrivateKeyStoreKey(profileHash), encryptedPrivateKeyHex);
      yield put(viewerRegister.success({ profileHash, privateKey, profile: newProfile }));
    } else {
      throw new Error('Profile 创建失败');
    }
  } catch (error) {
    yield put(viewerRegister.failure({ message: error.message }));
  }
}

/** 用户用密码登录之后，从本地加载用户的私钥和 profile */
export function* loadViewerSecret(action: ActionType) {
  try {
    const { password } = action.payload;
    const ipfs = new IPFSFileGetter();


    const profileHash = yield call(loadStorage, 'profileHash');
    const encryptedPrivateKeyHex = yield call(loadStorage, getPrivateKeyStoreKey(profileHash));
    const privateKey = decrypt(password, encryptedPrivateKeyHex);
    // get profile from IPFS
    yield call(ipfs.ready);
    const profile = yield call(ipfs.getFile, profileHash)
    console.log('loadViewerSecret', profile)
    yield put(viewerLogin.success({ privateKey, profileHash, profile: profile[0] }));
  } catch (error) {
    yield put(viewerLogin.failure({ message: error.message }));
  }
}

export const viewerSagas = [
  takeLatest(viewerRegister.TRIGGER, viewerRegisterSaga),
  takeLatest(viewerLogin.TRIGGER, loadViewerSecret),
];

type ViewerInitialStateType = {
  profile: KeyValue,
  privateKey: string,
  profileHash: string,
};

const viewerInitialState: ImmutableType<ViewerInitialStateType> = Immutable({
  profile: {},
  privateKey: '',
  profileHash: '',
});

export function viewerReducer(
  state: ImmutableType<ViewerInitialStateType> = viewerInitialState,
  action: ActionType,
): ImmutableType<ViewerInitialStateType> {
  switch (action.type) {
    case viewerRegister.SUCCESS:
    case viewerLogin.SUCCESS:
      return state
        .setIn('profile', action.payload.profile)
        .setIn('privateKey', action.payload.privateKey)
        .setIn('profileHash', action.payload.profileHash);

    default:
      return state;
  }
}
