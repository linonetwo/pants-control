import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { sagas, sagaMiddleware } from './reducers';
import { store, history } from './store';
import APIServer from './api';
import './app.global.css';

sagas.forEach(sagaMiddleware.run);


const PORT = 3000;
APIServer.listen(PORT, () => {
  console.log(`GraphQL API server running on port ${PORT}.`);
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
