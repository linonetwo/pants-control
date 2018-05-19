import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectorsPlugin from '@rematch/select';

import noteModel from './note';
import historyModel from './history';
import backendModel from './backend';

const immer = immerPlugin();
const select = selectorsPlugin();
const configureStore = ({ note, history, backend } = {}) =>
  init({
    models: {
      note: noteModel(note),
      history: historyModel(history),
      backend: backendModel(backend),
    },
    plugins: [immer, select],
  });

export default configureStore;
export { history } from './history';
