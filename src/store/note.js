/* eslint-disable no-await-in-loop */
// @flow
import Promise from 'bluebird';
import { uniq } from 'lodash';
import Plain from 'slate-plain-serializer';
import { Value } from 'slate';

export type Note = {
  content: Object,
  type: string,
  title: string,
  id: string,
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
    setNote(
      state: State,
      { note, id, title, type = 'document' }: { note: Object, id: string, title?: string, type?: string },
    ) {
      // get potential title of document
      let defaultTitle = id;
      if (
        !title &&
        type === 'document' &&
        note.getIn(['document', 'nodes', 0, 'type']) === 'title' &&
        note.getIn(['document', 'nodes', 0, 'nodes', 0, 'leaves', 0, 'text'])
      ) {
        defaultTitle = note
          .getIn(['document', 'nodes', 0, 'nodes', 0, 'leaves'])
          .map(leaf => leaf.get('text'))
          .join('');
      }
      // add id to ids if not exist
      if (!state.notes[id]) {
        state.ids.push(id);
      }
      // update note data
      state.notes[id] = {
        ...state.notes[id],
        id,
        type,
        content: note,
        title: title || defaultTitle,
      };
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
        const { content, ...rest } = JSON.parse(await dispatch.backend.load(id));
        this.setNote({ note: Value.fromJSON(content), ...rest, id });
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
        const { dispatch } = await import('./');
        const serializedNote = JSON.stringify(notes[id]);
        await dispatch.backend.save({ id, data: serializedNote });
      }
    },
    async saveNewNoteFromString({
      id,
      note = '',
      title,
      type,
    }: {
      id: string,
      note?: string,
      title?: string,
      type?: string,
    }) {
      const newNoteContent = Plain.deserialize(note);
      this.setNote({ note: newNoteContent, id, title, type });
      await this.saveNote(id);
    },
    async saveNewNoteFromJSONString({
      id,
      note = '',
      title,
      type,
    }: {
      id: string,
      note?: string,
      title?: string,
      type?: string,
    }) {
      const newNoteContent = Value.fromJSON(JSON.parse(note));
      this.setNote({ note: newNoteContent, id, title, type });
      await this.saveNote(id);
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
        await Promise.delay(1000);
      }
    },
  },
});
