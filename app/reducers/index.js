// @flow
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer as router } from 'react-router-redux';
import NLPSaga from './nlp';

export const sagaMiddleware = createSagaMiddleware();
export const sagas = [NLPSaga];

const rootReducer = combineReducers({
  router,
});

export default rootReducer;
