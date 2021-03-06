import React, { Component } from 'react';
import { Route, Switch } from 'react-router';

import './globalStyle';
import { dispatch } from './store';
import { APP_START } from './store/constants/core';
import NoteBook from './pages/NoteBook';
import Login from './pages/Login';

export default class Routes extends Component {
  async componentDidMount() {
    dispatch({ type: APP_START });
    await dispatch.viewer.rememberUser();
    dispatch.history.syncIDFromURLToStore();
  }

  render() {
    return (
      <Switch>
        {/* 登录和注册页 */}
        <Route exact path="/" component={Login} />
        {/* 通过 multihash 打开编辑器 */}
        <Route exact path="/note/:ID" component={NoteBook} />
      </Switch>
    );
  }
}
