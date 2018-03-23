// @flow
import Immutable, { type Immutable as ImmutableType } from 'seamless-immutable';
import keypair from 'keypair';
import { put, takeLatest, call, all } from 'redux-saga/effects';

import type { ActionType, KeyValue } from './types';
import { viewerRegister, viewerLogin, appStart, loadAvailableViewers } from './actions/core';
import IPFSFileUploader from '../ipfs/IPFSFileUploader';
import IPFSFileGetter from '../ipfs/IPFSFileGetter';
import nativeUtils from '../utils/nativeUtils';
import { encrypt, decrypt } from '../utils/crypto';

const { saveStorage, loadStorage } = nativeUtils.default;

const getPrivateKeyStoreKey = (profileHash: string) => `${profileHash}-private`;
const getLocalProfileHashStoreKey = (name: string) => `${name}-profileHash`;

/** 用户注册成功后把他注册的用户名保存到本地可登录的用户名列表里 */
async function pushAvailableUsers(newUserName: string) {
  const users = (await loadStorage('users')) || [];
  const newUsers = [...users, newUserName];
  await saveStorage('users', newUsers);
}

/** 加载本地可登录的用户名列表，用于登录时自动补全用户输入 */
function* getAvailableUsersSaga() {
  const users = (yield call(loadStorage, 'users')) || [];
  yield put(loadAvailableViewers.success({ viewers: users }));
}

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
      // Remember username in localStorage for later login
      yield all([call(saveStorage, name, profileHash), call(pushAvailableUsers, name)]);
      // inform UI that register succeed
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
    const { name, password } = action.payload;
    const ipfs = new IPFSFileGetter();

    const profileHash = yield call(loadStorage, getLocalProfileHashStoreKey(name));
    const encryptedPrivateKeyHex = yield call(loadStorage, getPrivateKeyStoreKey(profileHash));
    const privateKey = decrypt(password, encryptedPrivateKeyHex);
    // get profile from IPFS
    yield call(ipfs.ready);
    const profile = yield call(ipfs.getFile, profileHash);
    console.log('loadViewerSecret', profile);
    yield put(viewerLogin.success({ privateKey, profileHash, profile: profile[0] }));
  } catch (error) {
    yield put(viewerLogin.failure({ message: error.message }));
  }
}

export const viewerSagas = [
  takeLatest(viewerRegister.TRIGGER, viewerRegisterSaga),
  takeLatest(viewerLogin.TRIGGER, loadViewerSecret),
  takeLatest(appStart.TRIGGER, getAvailableUsersSaga),
];

type ViewerInitialStateType = {
  // 本机上可用的用户名列表
  viewers: string[],
  // 当前登录用户的档案
  profile: KeyValue,
  // 当前登录用户的档案的 IPFS 散列值
  profileHash: string,
  // 当前登录用户的私钥
  privateKey: string,
};

const viewerInitialState: ImmutableType<ViewerInitialStateType> = Immutable({
  viewers: [],
  profile: {},
  profileHash: '',
  privateKey: '',
});

export function viewerReducer(
  state: ImmutableType<ViewerInitialStateType> = viewerInitialState,
  action: ActionType,
): ImmutableType<ViewerInitialStateType> {
  switch (action.type) {
    case viewerRegister.SUCCESS:
    case viewerLogin.SUCCESS:
      return state
        .set('profile', action.payload.profile)
        .set('privateKey', action.payload.privateKey)
        .set('profileHash', action.payload.profileHash);

    case loadAvailableViewers.SUCCESS:
      return state.set('viewers', action.payload.viewers);

    default:
      return state;
  }
}
