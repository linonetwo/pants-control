import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router';

import './bodyStyle';
import registerServiceWorker from './registerServiceWorker';
import { store, history, sagaMiddleware, rootSaga } from './store';
import Editors from './components/editors';
import Login from './components/Login';


class App extends Component {
  componentDidMount() {
    sagaMiddleware.run(rootSaga);
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            {/* 登录和注册页 */}
            <Route exact path="/" component={Login} />
            {/* 通过 multihash 打开编辑器 */}
            <Route exact path="/hash/:multihash" component={Editors} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
