// @flow
import { createStore, applyMiddleware } from 'redux';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';

import rootReducer, { sagaMiddleware } from '../reducers';
import workerMiddleware from '../webWorkers';

const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(router, sagaMiddleware, workerMiddleware);

function configureStore() {
  return createStore(rootReducer, enhancer);
}

export default { configureStore, history };
