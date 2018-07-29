import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectorsPlugin from '@rematch/select';
import createLoadingPlugin from '@rematch/loading';

import noteModel from './note';
import historyModel, { history } from './history';
import backendModel from './backend';
import viewerModel from './viewer';

const immer = immerPlugin({
  blacklist: ['loading'],
});
const select = selectorsPlugin();
const loading = createLoadingPlugin({ whitelist: ['note/saveNote'] });
const configureStore = ({ note, history: historyInitialState, backend, viewer } = {}) =>
  init({
    models: {
      note: noteModel(note),
      history: historyModel(historyInitialState),
      backend: backendModel(backend),
      viewer: viewerModel(viewer),
    },
    plugins: [immer, select, loading],
  });

export default configureStore;
export const store = configureStore();
export const { dispatch, getState } = store;

history.listen(async location => {
  if (/\/note\//.test(location.pathname)) {
    dispatch.history.syncIDFromURLToStore();
  }
});
export { history };
