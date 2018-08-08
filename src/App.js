import React from 'react';
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { hydrate, render } from 'react-dom';

import './globalStyle';
import register from './registerServiceWorker';
import { store, history } from './store';
import Routes from './Routes';

const Application = (
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>
);

const root = document.getElementById('root');
if (root.hasChildNodes()) {
  Loadable.preloadReady().then(() => {
    hydrate(Application, root);
  });
} else {
  render(Application, root);
}
register();
