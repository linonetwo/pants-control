import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux'
import { Route } from 'react-router'

import { store, history } from './store';

import Editors from './editors';

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

export default App;
