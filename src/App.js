import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import styled from 'react-emotion/macro';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';

import registerServiceWorker from './registerServiceWorker';
import { store, history } from './store';
import Editors from './editors';

import './bodyStyle';

const headerHeight = '50px';
const Header = styled.header`
  position: absolute;
  top: 0;
  height: ${headerHeight};
`;
const EditorScroll = styled.div`
  height: calc(100vh - ${headerHeight});
  margin-top: ${headerHeight};
  overflow-y: scroll;
  overflow-x: hidden;
`;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Header>
              <h1>Welcome to Pants-Control</h1>
            </Header>
            <EditorScroll>
              <Editors />
            </EditorScroll>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
