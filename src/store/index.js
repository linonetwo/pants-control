// @flow
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware, routerActions, routerReducer as router } from 'react-router-redux';
import { reduxBatch } from '@manaflair/redux-batch';

// import workerMiddleware from '../workers';

// import executeSaga from './execute';
// import configSaga, { configReducer } from './config';
// import cardSaga, { cardsReducer } from './cards';
// import startupSaga from './startup';

export const sagaMiddleware = createSagaMiddleware();
export const sagas = [];

export const rootReducer = combineReducers({
  router,
  // cards: cardsReducer,
  // config: configReducer,
});

export const history = createHistory();

export const configureStore = () => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // workers for hard calc
  // middleware.push(workerMiddleware);

  // Router Middleware
  middleware.push(routerMiddleware(history));

  // redux-saga
  middleware.push(sagaMiddleware);

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators,
    })
    : compose;

  // Apply Middleware & Compose Enhancers
  enhancers.push(reduxBatch);
  enhancers.push(applyMiddleware(...middleware));
  enhancers.push(reduxBatch);
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, enhancer);

  return store;
};

export const store = configureStore();
