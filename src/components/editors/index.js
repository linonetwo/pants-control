// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import SlateEditor from './Slate';

const EditorScroll = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export default class Editors extends Component {
  render() {
    return (
      <EditorScroll>
        <SlateEditor />
      </EditorScroll>
    );
  }
}
