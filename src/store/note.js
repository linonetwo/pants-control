// @flow
import produce from 'immer';
import { dispatch } from '@rematch/core';

type State = {
  // 扁平化的笔记
  notes: { [id: string]: string },
  ids: string[],
  // 没有持久化的笔记 ID
  notSyncedNoteIDs: string[],
  // 当前打开的笔记 ID
  currentNoteID: string,
};
export default (initialState: State) => ({
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
      return produce(state, draft => {
        draft.notes[id] = note;
        draft.ids.push(id);
        return draft;
      });
    },
    focusNote(state: State, id: string) {
      return produce(state, draft => {
        draft.currentNoteID = id;
        return draft;
      });
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
