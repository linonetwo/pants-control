// @flow

type State = {};
export default (initialState?: State = {}) => ({
  state: { ...initialState },
  effects: {
    async syncIDFromURLToStore() {
      const { dispatch, getState, history } = await import('./');
      // if user is inside a note page, loads note data
      if (/\/note\//.test(history.location.pathname)) {
        const {
          note: { currentNoteID },
        } = getState();
        // if url change is dispatched by some effect, don't load data
        // note that location.state is persist after refreshing page, so check currentNoteID first(currentNoteID === null after refreshing page)
        if (currentNoteID && typeof history.location.state === 'object' && history.location.state?.loading === false) {
          return null;
        }
        const currentNoteIDInURL = history.location.pathname.split('/note/')[1].replace('/', '');
        return dispatch.note.openNote(currentNoteIDInURL);
      }
    },
  },
});
