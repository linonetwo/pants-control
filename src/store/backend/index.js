// @flow
import IPFSFileUploader from './ipfs/IPFSFileUploader';
import IPFSFileGetter from './ipfs/IPFSFileGetter';

type State = {
  currentBackEnd?: string,
};
export default (initialState: State) => ({
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
    save(id: string, note: string) {
      switch (this.currentBackEnd) {
        case 'ipfs':
          return this.saveNoteToIPFS(id, note);
        default:
          throw new Error('No backend configured');
      }
    },
    load(id: string) {
      switch (this.currentBackEnd) {
        case 'ipfs':
          return this.loadNoteFromIPFS(id);
        default:
          throw new Error('No backend configured');
      }
    },
    async saveNoteToIPFS(id: string, note: string) {
      const ipfs = await IPFSFileUploader.create();
      const { hash } = await ipfs.uploadObject(note);
      // TODO: save id -> hash mapping to a storage for example IPNS node
    },
    async loadNoteFromIPFS(id: string) {
      // TODO: get hash by id from some storage
      const hash = id; // TODO: placeholder
      const ipfs = await IPFSFileGetter.create();
      const files = await ipfs.getFile(hash);
      return files;
    },
  },
});
