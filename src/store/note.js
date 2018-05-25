// @flow
import { uniq } from 'lodash';
import { Value } from 'slate';

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
  currentNoteID: string,
};
export default (initialState?: * = {}) => ({
  state: {
    notes: {},
    ids: [],
    notSyncedNoteIDs: [],
    currentNoteID: null,
    sideNoteID: null,
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
    focusNote(state: State, id: string) {
      state.currentNoteID = id;
      return state;
    },
  },
  effects: {
    async openNote(id: string) {
      if (!this.ids.includes(id)) {
        const { dispatch } = await import('./');
        // load note from IPFS or server
        const note = JSON.parse(await dispatch.backend.load(id));
        this.setNote({ note, id });
      }
      this.focusNote(id);
    },
    async saveNote(id: string) {
      if (!this.ids.includes(id)) {
        const {
          note: { notes },
          dispatch,
        } = await import('./');
        if (id in notes) {
          const serializedNote = JSON.stringify(notes[id].content);
          await dispatch.backend.save({ id, data: serializedNote });
        }
      }
    },
    async syncToBackend() {
      const {
        note: { notSyncedNoteIDs },
      }: {
        note: {
          notSyncedNoteIDs: string[],
        },
      } = await import('./');
      if (notSyncedNoteIDs.length === 0) return;
      return Promise.all(notSyncedNoteIDs.map(id => this.saveNote(id)));
    },
  },
});
