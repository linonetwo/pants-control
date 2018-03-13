// @flow
import React, { Component, Fragment } from 'react';
import styled from 'react-emotion/macro';

import SlateEditor from './Slate';

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

export default class Editors extends Component {
  render() {
    return (
      <Fragment>
        <Header>
          <h1>Welcome to Pants-Control</h1>
        </Header>
        <EditorScroll>
          <SlateEditor />
        </EditorScroll>
      </Fragment>
    );
  }
}
