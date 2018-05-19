// @flow
import IPFSFileUploader from './ipfs/IPFSFileUploader';
import IPFSFileGetter from './ipfs/IPFSFileGetter';
import getLevelDB from './levelDB';

type State = {
  currentBackEnd?: string,
};
export default (initialState?: State) => ({
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
    save(id: string, data: string) {
      switch (this.currentBackEnd) {
        case 'ipfs':
        return this.saveDataToIPFS(id, data);
        case 'levelDB':
        default:
          return this.saveDataToLevelDB(id, data);
      }
    },
    load(id: string) {
      switch (this.currentBackEnd) {
        case 'ipfs':
          return this.loadDataFromIPFS(id);
        default:
          return this.loadDataFromLevelDB(id)
      }
    },

    async saveDataToIPFS(id: string, data: string) {
      const ipfs = await IPFSFileUploader.create();
      const { hash } = await ipfs.uploadObject(data);
      // TODO: save id -> hash mapping to a storage for example IPNS node
    },
    async loadDataFromIPFS(id: string) {
      // TODO: get hash by id from some storage
      const hash = id; // TODO: placeholder
      const ipfs = await IPFSFileGetter.create();
      const files = await ipfs.getFile(hash);
      return files;
    },

    async saveDataToLevelDB(id: string, data: string) {
      const db = getLevelDB();
      await db.put(id, data);
    },
    async loadDataFromLevelDB(id: string): Promise<string> {
      const db = getLevelDB();
      const data = await db.get(id)
      return data;
    },
  },
});
