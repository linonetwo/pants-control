// @flow
import Immutable, { type Immutable as ImmutableType } from 'seamless-immutable';
import keypair from 'keypair';
import { put, takeLatest, call, all } from 'redux-saga/effects';

import type { ActionType, KeyValue } from './types';
import { viewerRegister, viewerLogin, appStart, loadAvailableViewers } from './actions/core';
import IPFSFileUploader from '../ipfs/IPFSFileUploader';
import IPFSFileGetter from '../ipfs/IPFSFileGetter';
import { saveStorage, loadStorage } from '../utils/nativeUtils';
import { encrypt, decrypt } from '../utils/crypto';

const getPrivateKeyStoreKey = (profileHash: string) => `${profileHash}-private`;
const getLocalProfileHashStoreKey = (name: string) => `${name}-profileHash`;

async function getAvailableUsers(): string[] {
  const usersString = await loadStorage('users');
  const users = usersString ? JSON.parse(usersString) : [];
  return users;
}
/** 用户注册成功后把他注册的用户名保存到本地可登录的用户名列表里 */
async function pushAvailableUsers(newUserName: string) {
  const users = await getAvailableUsers();
  const newUsers = [...users, newUserName];
  await saveStorage('users', JSON.stringify(newUsers));
}

/** 加载本地可登录的用户名列表，用于登录时自动补全用户输入 */
function* getAvailableUsersSaga() {
  const users = yield call(getAvailableUsers);
  yield put(loadAvailableViewers.success({ viewers: users }));
}

/** 创建用户公私钥和 profile，公钥放在 profile 里，私钥用密码加密后放在 localStorage 或者本地 */
export function* viewerRegisterSaga(action: ActionType) {
  try {
    const { name, password } = action.payload;
    const ipfs = yield IPFSFileUploader.create();

    const { public: publicKey, private: privateKey } = keypair();
    const encryptedPrivateKeyHex = yield call(encrypt, name, password, privateKey);

    // prepare profile
    const newProfile = {
      '@context': 'http://schema.org',
      '@type': 'Person',
      name,
      description: '',
      publicKey,
    };
    // Put profile to IPFS
    const { hash: profileHash } = yield call(ipfs.uploadObject, newProfile);
    console.log(`viewerRegisterSaga profile created at https://ipfs.io/ipfs/${profileHash}`)
    if (profileHash) {
      // Put private key to localStorage
      yield call(saveStorage, getPrivateKeyStoreKey(profileHash), encryptedPrivateKeyHex);
      // Remember username in localStorage for later login
      yield all([call(saveStorage, getLocalProfileHashStoreKey(name), profileHash), call(pushAvailableUsers, name)]);
      // inform UI that register succeed
      yield put(viewerRegister.success({ profileHash, privateKey, profile: newProfile }));
    } else {
      throw new Error('Profile 创建失败');
    }
  } catch (error) {
    yield put(viewerRegister.failure({ message: error.message }));
    console.error(error);
  }
}

/** 用户用密码登录之后，从本地加载用户的私钥和 profile */
export function* loadViewerSecret(action: ActionType) {
  try {
    const { name, password } = action.payload;
    const ipfs = yield IPFSFileGetter.create();

    const profileHash = yield call(loadStorage, getLocalProfileHashStoreKey(name));
    const encryptedPrivateKeyHex = yield call(loadStorage, getPrivateKeyStoreKey(profileHash));
    const privateKey = yield call(decrypt, name, password, encryptedPrivateKeyHex);
    // get profile from IPFS
    console.log('loadViewerSecret start loading profile from IPFS.')
    const profile = yield call(ipfs.getFile, profileHash);
    console.log('loadViewerSecret', profile);
    yield put(viewerLogin.success({ privateKey, profileHash, profile: profile[0] }));
  } catch (error) {
    yield put(viewerLogin.failure({ message: error.message }));
    console.error(error);
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
