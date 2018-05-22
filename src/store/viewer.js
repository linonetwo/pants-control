// @flow
import keypair from 'keypair';
import uuid from 'uuid/v4';

import { saveStorage, loadStorage } from '../utils/nativeUtils';
import { encrypt, decrypt, checkKeyPair } from '../utils/crypto';

const getPrivateKeyStoreKey = (profileID: string) => `${profileID}-private`;
const getLocalProfileIDStoreKey = (name: string) => `${name}-profileID`;

type State = {
  // 界面上显示的登录时可以使用的账号列表
  availableUsers: string[],
  profile: Object,
  privateKey: string,
};
export type ViewerDispatch = {
  userLogin: ({ name: string, password: string }) => void,
  createUser: ({ name: string, password: string }) => void,
  getAvailableUsers: void => void,
};
export default (initialState?: * = {}) => ({
  state: {
    availableUsers: [],
    profile: {},
    privateKey: '',
    ...initialState,
  },
  reducers: {
    setAvailableUsers(state: State, users: string[]) {
      state.availableUsers = users;
      return state;
    },
    setProfile(state: State, newProfile: Object) {
      state.profile = newProfile;
      return state;
    },
    setPrivateKey(state: State, privateKey: string) {
      state.privateKey = privateKey;
      return state;
    },
  },
  effects: {
    async getAvailableUsers(): Promise<string[]> {
      const usersString = await loadStorage('users');
      const users = usersString ? JSON.parse(usersString) : [];
      this.setAvailableUsers(users);
      return users;
    },
    /** 用户注册成功后把他注册的用户名保存到本地可登录的用户名列表里 */
    async pushAvailableUsers(newUserName: string) {
      const users = await this.getAvailableUsers();
      const newUsers = [...users, newUserName];
      await saveStorage('users', JSON.stringify(newUsers));
      this.setAvailableUsers(newUsers);
    },
    async createUser({ name, password }: { name: string, password: string }) {
      // TODO: switch to https://ed25519.cr.yp.to/ ? like textileio does
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
        const { store } = await import('./');
        store.dispatch.backend.save({ id: profileID, data: JSON.stringify(newProfile, null, '  ') });
        // Put private key to localStorage
        await saveStorage(getPrivateKeyStoreKey(profileID), encryptedPrivateKeyHex);
        // Remember username in localStorage for later login
        await Promise.all([saveStorage(getLocalProfileIDStoreKey(name), profileID), this.pushAvailableUsers(name)]);
        // inform UI that register succeed
        this.setProfile(newProfile);
        this.setPrivateKey(privateKey);
        console.log(publicKey, privateKey);
      } catch (error) {
        console.error(error);
        throw new Error('Profile 创建失败');
      }
    },
    async userLogin({ name, password }: { name: string, password: string }) {
      try {
        // loads profile
        const profileID = await loadStorage(getLocalProfileIDStoreKey(name));
        const { store } = await import('./');
        const profileString = await store.dispatch.backend.load(profileID);
        const profile = JSON.parse(profileString);
        // checks password
        const encryptedPrivateKeyHex = await loadStorage(getPrivateKeyStoreKey(profileID));
        const privateKey = await decrypt(name, password, encryptedPrivateKeyHex);

        try {
          if (!checkKeyPair(profile.publicKey, privateKey)) {
            throw new Error('密码错误');
          }
        } catch (err) {
          throw new Error('密码错误');
        }
        // get profile from backend
        // inform UI that loading succeed
        this.setProfile(profile);
        this.setPrivateKey(privateKey);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
