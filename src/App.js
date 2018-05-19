import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';

import './globalStyle';
import registerServiceWorker from './registerServiceWorker';
import { store, history } from './store';
import { APP_START } from './store/constants/core';
import Editors from './components/Editors';
import Login from './components/Login';

class App extends Component {
  componentDidMount() {
    store.dispatch({ type: APP_START });
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            {/* 登录和注册页 */}
            <Route exact path="/" component={Login} />
            {/* 通过 multihash 打开编辑器 */}
            <Route exact path="/note/:ID" component={Editors} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
