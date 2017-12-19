// @flow
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer as router } from 'react-router-redux';
import NLPSaga from './nlp';
import executeSaga from './execute';
import configSaga, { configReducer } from './config';
import cardSaga, { cardsReducer } from './cards';
import startupSaga from './startup';

export const sagaMiddleware = createSagaMiddleware();
export const sagas = [NLPSaga, executeSaga, cardSaga, configSaga, startupSaga];

const rootReducer = combineReducers({
  router,
  cards: cardsReducer,
  config: configReducer,
});

export default rootReducer;
