// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import SlateEditor from './Slate';

const EditorScroll = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px 100px;
  ${({ sideBar }) =>
    sideBar &&
    css`
      background-color: whitesmoke;
      padding: 10px;
    `};
`;

export default class Editors extends Component<*> {
  render() {
    return (
      <EditorScroll sideBar={this.props.sideBar}>
        <SlateEditor noteID={this.props.noteID} />
      </EditorScroll>
    );
  }
}
