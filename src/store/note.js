// @flow
import { dispatch } from '@rematch/core';

export type Note = {
  content: string,
};
type State = {
  // 扁平化的笔记
  notes: { [id: string]: Note },
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
    currentNoteID: '',
    ...initialState,
  },
  reducers: {
    /** 保存笔记内容到内存 */
    setNote(state: State, { note, id }: { note: string, id: string }) {
      if (!state.notes[id]) {
        state.notes[id] = {
          content: note,
        };
        state.ids.push(id);
      } else {
        state.notes[id].content = note;
      }
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
        // load note from IPFS or server
        const note = await dispatch.backend.load(id);
        this.setNote({ note, id });
      }
      this.focusNote(id);
    },
  },
});
