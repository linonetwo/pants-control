import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectorsPlugin from '@rematch/select';
import createLoadingPlugin from '@rematch/loading';
import { createBrowserHistory, createMemoryHistory } from 'history';

import noteModel from './note';
import historyModel from './history';
import backendModel from './backend';
import viewerModel from './viewer';
import { isServer, getInitialStateFromServer } from '../utils/nativeUtils';

const immer = immerPlugin();
const select = selectorsPlugin();
const loading = createLoadingPlugin({ whitelist: ['note/saveNote'] });
const configureStore = (initialState = {}) => {
  const initialStateFromServer = getInitialStateFromServer();

  const {
    note: noteInitialState,
    history: historyInitialState,
    backend: backendInitialState,
    viewer: viewerInitialState,
    url = '/',
  } = { initialState, ...initialStateFromServer };

  const history = isServer
    ? createMemoryHistory({
        initialEntries: [url],
      })
    : createBrowserHistory();
  history.location.state = {};

  return {
    store: init({
      models: {
        note: noteModel(noteInitialState),
        history: historyModel(historyInitialState),
        backend: backendModel(backendInitialState),
        viewer: viewerModel(viewerInitialState),
      },
      plugins: [immer, select, loading],
    }),
    history,
  };
};

export default configureStore;
