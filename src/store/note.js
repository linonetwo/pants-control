/* eslint-disable no-await-in-loop */
// @flow
import Promise from 'bluebird';
import { uniq } from 'lodash';
import Plain from 'slate-plain-serializer';

export type Note = {
  content: Object,
};
export type Notes = { [id: string]: Note };
type State = {
  // 扁平化的笔记
  notes: Notes,
  ids: string[],
  // 没有持久化的笔记 ID
  notSyncedNoteIDs: string[],
  // 当前打开的笔记 ID
  currentNoteID: string | null,
  // 当前打开的侧边栏 ID
  sideNoteID: string | null,
  // 是否正在同步数据到后端
  syncing: boolean,
};
export default (initialState?: * = {}) => ({
  state: {
    notes: {},
    ids: [],
    notSyncedNoteIDs: [],
    currentNoteID: null,
    sideNoteID: null,
    syncing: false,
    ...initialState,
  },
  reducers: {
    /** 保存笔记内容到内存 */
    setNote(state: State, { note, id }: { note: Object, id: string }) {
      if (!state.notes[id]) {
        state.notes[id] = {
          content: note,
        };
        state.ids.push(id);
      } else {
        state.notes[id].content = note;
      }
      // add note to ready to sync list, sync it to backend later
      state.notSyncedNoteIDs = uniq([...state.notSyncedNoteIDs, id]);
      return state;
    },
    clearNotSyncedNoteIDs(state: State) {
      state.notSyncedNoteIDs = [];
      return state;
    },
    focusNote(state: State, id: string) {
      state.currentNoteID = id;
      return state;
    },
    setSideNote(state: State, id: string) {
      state.sideNoteID = id;
      return state;
    },
    disallowSyncing(state: State) {
      state.syncing = false;
      return state;
    },
    allowSyncing(state: State) {
      state.syncing = true;
      return state;
    },
  },
  effects: {
    async openNote(
      id: string,
      {
        note: { ids },
      }: { note: State },
    ) {
      if (!ids.includes(id)) {
        const { dispatch } = await import('./');
        // load note from IPFS or server
        const note = JSON.parse(await dispatch.backend.load(id));
        this.setNote({ note, id });
      }
      this.focusNote(id);
    },
    async saveNote(
      id: string,
      {
        note: { ids, notes },
      }: { note: State },
    ) {
      if (ids.includes(id) && id in notes) {
        const serializedNote = JSON.stringify(notes[id].content);
        const { dispatch } = await import('./');
        await dispatch.backend.save({ id, data: serializedNote });
      }
    },
    saveNewEmptyNote(id: string) {
      const newNoteContent = Plain.deserialize('');
      this.setNote({ note: newNoteContent, id });
      this.saveNote(id);
    },
    async syncToBackend(
      _: any,
      {
        note: { syncing: alreadySyncing },
      }: { note: State },
    ) {
      if (alreadySyncing) return;
      this.allowSyncing();
      const { getState } = await import('./');
      while (true) {
        const {
          note: { syncing, notSyncedNoteIDs },
        } = await getState();
        if (!syncing) break;
        if (notSyncedNoteIDs.length !== 0) {
          await Promise.all(notSyncedNoteIDs.map(id => this.saveNote(id)));
          this.clearNotSyncedNoteIDs();
        }
        await Promise.delay(5000);
      }
    },
  },
});
