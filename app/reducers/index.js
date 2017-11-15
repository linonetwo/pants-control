// @flow
import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer as router } from 'react-router-redux';
import NLPSaga from './nlp';
import cardSaga, { cardsReducer } from './cards';

export const sagaMiddleware = createSagaMiddleware();
export const sagas = [NLPSaga, cardSaga];

const rootReducer = combineReducers({
  router,
  cards: cardsReducer,
});

export default rootReducer;
