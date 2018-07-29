// @flow
import keypair from 'keypair';
import uuid from 'uuid/v4';
import { message } from 'antd';
import queryString from 'query-string';
import Plain from 'slate-plain-serializer';
import { Value } from 'slate';

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
    async createUser({ name, password, remember }: { name: string, password: string, remember?: number }) {
      // TODO: switch to https://ed25519.cr.yp.to/ ? like textileio does
      const { public: publicKey, private: privateKey } = keypair();
      const encryptedPrivateKeyHex = await encrypt(name, password, privateKey);

      // prepare profile
      const homepageID = uuid();
      const sideNoteID = uuid();
      const profileID = uuid();
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
        'foaf:homepage': homepageID,
        'pants-control:sideNote': sideNoteID,
      };
      try {
        const { dispatch, history } = await import('./');
        // Put private key to localStorage
        await saveStorage(getPrivateKeyStoreKey(profileID), encryptedPrivateKeyHex);
        // Remember username in localStorage for later login
        await Promise.all([saveStorage(getLocalProfileIDStoreKey(name), profileID), this.pushAvailableUsers(name)]);
        // Remember username for 8 Days so later it can auto login
        if (remember && typeof remember === 'number') {
          await saveStorage(
            'currentUser',
            JSON.stringify({ name, password, expire: Date.now() + remember * 24 * 3600 * 1000 }),
          );
        }
        // inform UI that register succeed
        this.setProfile(newProfile);
        this.setPrivateKey(privateKey);
        // create initial notes
        await dispatch.note.saveNewNoteFromString({ id: profileID, note: JSON.stringify(newProfile, null, '  ') });
        await dispatch.note.saveNewNoteFromJSONString({
          id: sideNoteID,
          note:
            '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"title","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"侧边栏可以自由编辑","marks":[]}]}]},{"object":"block","type":"note-list","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"笔记目录","marks":[]}]}]}]}}',
        });
        await dispatch.note.setSideNote(sideNoteID);
        await dispatch.note.saveNewNoteFromString({ id: homepageID });
        // start syncing, looping
        dispatch.note.syncToBackend();
        // If user come from a note and just want to login and come back to that note
        const currentQueryString = queryString.parse(history.location.search);
        if (currentQueryString?.note) {
          return history.push(`/note/${currentQueryString.note}/`, { loading: false });
        }
        // goto homepage after register
        return history.push(`/note/${newProfile['foaf:homepage']}/`, { loading: false });
      } catch (error) {
        console.error(error);
        message.warning(error.message);
        throw new Error('Profile 创建失败');
      }
    },
    async rememberUser() {
      const remembered = await loadStorage('currentUser');
      if (remembered) {
        const { name, password, expire } = JSON.parse(remembered);
        if (expire && expire - Date.now() > 0) {
          message.loading('正在登录记住的账户', 0.5);
          return this.userLogin({ name, password });
        }
      }
    },
    async userLogin({ name, password, remember }: { name: string, password: string, remember?: number }) {
      try {
        // loads profile
        const profileID = await loadStorage(getLocalProfileIDStoreKey(name));
        const { dispatch, history } = await import('./');
        const profileString = await dispatch.backend.load(profileID);
        let profile = {};
        try {
          profile = JSON.parse(Plain.serialize(Value.fromJSON(JSON.parse(profileString))));
        } catch (error) {
          throw new Error(`Profile 格式不对：\n${profileString}`);
        }
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
        // Remember username for 8 Days so later it can auto login
        if (remember && typeof remember === 'number') {
          await saveStorage(
            'currentUser',
            JSON.stringify({ name, password, expire: Date.now() + remember * 24 * 3600 * 1000 }),
          );
        }
        // get profile from backend
        // inform UI that loading succeed
        this.setProfile(profile);
        this.setPrivateKey(privateKey);
        // load notes
        await dispatch.note.openNote(profile['pants-control:sideNote']);
        await dispatch.note.openNote(profileID);
        await dispatch.note.setSideNote(profile['pants-control:sideNote']);
        await dispatch.note.openNote(profile['foaf:homepage']);
        // start syncing, looping
        dispatch.note.syncToBackend();
        // If user come from a note and just want to login and come back to that note
        const currentQueryString = queryString.parse(history.location.search);
        if (currentQueryString?.note) {
          return history.push(`/note/${currentQueryString.note}/`, { loading: false });
        }
        // if user is not viewing a page, then goto homepage
        if (!/\/note\//.test(history.location.pathname)) {
          return history.push(`/note/${profile['foaf:homepage']}/`, { loading: false });
        }
      } catch (error) {
        console.error(error);
        message.warning(error.message);
      }
    },
  },
});
