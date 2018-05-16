// @flow
import produce from 'immer';
import keypair from 'keypair';
import { dispatch } from '@rematch/core';
import uuid from 'uuid/v4';

import { saveStorage, loadStorage } from '../utils/nativeUtils';
import { encrypt, decrypt } from '../utils/crypto';

const getPrivateKeyStoreKey = (profileID: string) => `${profileID}-private`;
const getLocalProfileIDStoreKey = (name: string) => `${name}-profileID`;

type State = {
  // 界面上显示的登录时可以使用的账号列表
  availableUsers: string[],
  profile: Object,
  privateKey: string,
};
export default (initialState: State) => ({
  state: {
    availableUsers: [],
    profile: {},
    privateKey: '',
    ...initialState,
  },
  reducers: {
    setAvailableUsers(state: State, users: string[]) {
      return produce(state, draft => {
        draft.availableUsers = users;
        return draft;
      });
    },
    setProfile(state: State, newProfile: Object) {
      return produce(state, draft => {
        draft.profile = newProfile;
        return draft;
      });
    },
    setPrivateKey(state: State, privateKey: Object) {
      return produce(state, draft => {
        draft.privateKey = privateKey;
        return draft;
      });
    },
  },
  effects: {
    async getAvailableUsers() {
      const usersString = await loadStorage('users');
      const users = usersString ? JSON.parse(usersString) : [];
      this.setAvailableUsers(users);
    },
    /** 用户注册成功后把他注册的用户名保存到本地可登录的用户名列表里 */
    async pushAvailableUsers(newUserName: string) {
      const users = await this.getAvailableUsers();
      const newUsers = [...users, newUserName];
      await saveStorage('users', JSON.stringify(newUsers));
      this.setAvailableUsers(newUsers);
    },
    async createUser(name: string, password: string) {
      const { public: publicKey, private: privateKey } = keypair();
      const encryptedPrivateKeyHex = await encrypt(name, password, privateKey);

      // prepare profile
      const newProfile = {
        '@context': {
          '@vocab': 'http://schema.org',
          foaf: 'http://xmlns.com/foaf/0.1/',
        },
        // @id could be a IPNS URI
        '@id': '',
        '@type': 'Person',
        name,
        description: '',
        publicKey,
        'foaf:homepage': '',
      };
      const profileID = uuid();
      try {
        // save profile to backend
        dispatch.backend.save(profileID, newProfile);
        // Put private key to localStorage
        await saveStorage(getPrivateKeyStoreKey(profileID), encryptedPrivateKeyHex);
        // Remember username in localStorage for later login
        await Promise.all([saveStorage(getLocalProfileIDStoreKey(name), profileID), this.pushAvailableUsers(name)]);
        // inform UI that register succeed
        this.setProfile(newProfile);
        this.setPrivateKey(privateKey);
      } catch (error) {
        console.error(error);
        throw new Error('Profile 创建失败');
      }
    },
    async loadUserSecret(name: string, password: string) {
      const profileID = await loadStorage(getLocalProfileIDStoreKey(name));
      const encryptedPrivateKeyHex = await loadStorage(getPrivateKeyStoreKey(profileID));
      const privateKey = await decrypt(name, password, encryptedPrivateKeyHex);
      try {
        // get profile from backend
        const profile = await dispatch.backend.load(profileID);
        // inform UI that loading succeed
        this.setProfile(profile);
        this.setPrivateKey(privateKey);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
