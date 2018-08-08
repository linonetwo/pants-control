import configureStore from './configureStore';

const { store, history } = configureStore();
history.listen(async location => {
  if (/\/note\//.test(location.pathname)) {
    const {
      store: { dispatch },
    } = await import('.');
    dispatch.history.syncIDFromURLToStore();
  }
});
export { store, history };
export const { dispatch, getState } = store;
