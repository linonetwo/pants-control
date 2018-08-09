// @flow
import IPFSFileUploader from './ipfs/IPFSFileUploader';
import IPFSFileGetter from './ipfs/IPFSFileGetter';
import getLevelDB from './levelDB';
import { isSSR } from '../../utils/nativeUtils';

type State = {
  currentBackEnd?: string,
};
export default (initialState?: * = {}) => ({
  state: {
    currentBackEnd: undefined,
    ...initialState,
  },
  reducers: {
    activatingBackend(state: State, backendToActivate: string) {
      state.currentBackEnd = backendToActivate;
      return state;
    },
  },
  effects: {
    save(payload: { id: string, data: * }) {
      if (isSSR) {
        console.warn("Don't support save in SSR.");
        return null;
      }
      switch (this.currentBackEnd) {
        case 'ipfs':
          return this.saveDataToIPFS(payload);
        case 'levelDB':
        default:
          return this.saveDataToLevelDB(payload);
      }
    },
    load(id: string): Promise<*> {
      if (isSSR) {
        console.warn("Don't support load in SSR.");
        return null;
      }
      switch (this.currentBackEnd) {
        case 'ipfs':
          return this.loadDataFromIPFS(id);
        case 'levelDB':
        default:
          return this.loadDataFromLevelDB(id);
      }
    },

    async saveDataToIPFS({ id, data }: { id: string, data: string }) {
      const ipfs = await IPFSFileUploader.create();
      const { hash } = await ipfs.uploadObject(data);
      // TODO: save id -> hash mapping to a storage for example IPNS node
    },
    async loadDataFromIPFS(id: string): Promise<string> {
      // TODO: get hash by id from some storage
      const hash = id; // TODO: placeholder
      const ipfs = await IPFSFileGetter.create();
      const files = await ipfs.getFile(hash);
      return files;
    },

    async saveDataToLevelDB({ id, data }: { id: string, data: * }) {
      const db = await getLevelDB();
      await db.put(id, data);
    },
    async loadDataFromLevelDB(id: string): Promise<*> {
      const db = await getLevelDB();
      const data = await db.get(id);
      return data;
    },
  },
});
