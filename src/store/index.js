import { init } from '@rematch/core';
import noteModel from './note';
import historyModel from './history';
import backendModel from './backend';

const configureStore = ({ note, history, backend } = {}) =>
  init({
    models: {
      note: noteModel(note),
      history: historyModel(history),
      backend: backendModel(backend),
    },
  });

export default configureStore;
export { history } from './history';
