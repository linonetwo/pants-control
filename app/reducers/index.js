// @flow
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer as router } from 'react-router-redux';
import NLPSaga from './nlp';
import executeSaga from './execute';
import cardSaga, { cardsReducer } from './cards';
import startupSaga from './startup';

export const sagaMiddleware = createSagaMiddleware();
export const sagas = [startupSaga, NLPSaga, executeSaga, cardSaga];

const rootReducer = combineReducers({
  router,
  cards: cardsReducer,
});

export default rootReducer;
