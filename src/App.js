import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';

import registerServiceWorker from './registerServiceWorker';
import { store, history } from './store';
import Editors from './editors';

import './bodyStyle';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <header>
              <h1>Welcome to Pants-Control</h1>
            </header>
            <Editors />
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();