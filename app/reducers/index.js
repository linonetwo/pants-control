// @flow
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer as router } from 'react-router-redux';
import { routinesWatcherSaga } from 'redux-saga-routines';
import NLPSaga from './nlp';

export const sagaMiddleware = createSagaMiddleware();
export const sagas = [routinesWatcherSaga, NLPSaga];

const rootReducer = combineReducers({
  router,
});

export default rootReducer;
