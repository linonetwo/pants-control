import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectorsPlugin from '@rematch/select';

import noteModel from './note';
import historyModel, { history } from './history';
import backendModel from './backend';
import viewerModel from './viewer';

const immer = immerPlugin();
const select = selectorsPlugin();
const configureStore = ({ note, history: historyInitialState, backend, viewer } = {}) =>
  init({
    models: {
      note: noteModel(note),
      history: historyModel(historyInitialState),
      backend: backendModel(backend),
      viewer: viewerModel(viewer),
    },
    plugins: [immer, select],
  });

export default configureStore;
export const store = configureStore();

history.listen(async location => {
  const { dispatch } = store;
  if (/\/note\//.test(location.pathname)) {
    dispatch.note.openNote(location.pathname.replace('/note/', ''));
  }
});
export { history };
