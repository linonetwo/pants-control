// @flow
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();

type State = {};
export default (initialState?: State = {}) => ({
  state: { ...initialState },
  effects: {
    async syncIDFromURLToStore() {
      const { dispatch } = await import('./');
      if (/\/note\//.test(history.location.pathname)) {
        const currentNoteIDInURL = history.location.pathname.split('/note/')[1].replace('/', '');
        return dispatch.note.openNote(currentNoteIDInURL);
      }
    },
  },
});
