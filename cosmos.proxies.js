import createFetchProxy from 'react-cosmos-fetch-proxy';
import createReduxProxy from 'react-cosmos-redux-proxy';
import createRouterProxy from 'react-cosmos-router-proxy';

import './src/globalStyle';
import configureStore from './src/store';

const ReduxProxy = createReduxProxy({
  createStore: initialState => configureStore(initialState),
});

export default [ReduxProxy, createRouterProxy()];
