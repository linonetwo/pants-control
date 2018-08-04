// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';

import SlateEditor from './Slate';

export const headerHeight = '30px';
const EditorScroll = styled.div`
  height: calc(100% - ${headerHeight});
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px 100px;
  ${({ sideBar }) =>
    sideBar &&
    css`
      height: 100%;
      background-color: whitesmoke;
      padding: 10px;
      padding-left: 30px;
    `};
`;

export default class Editors extends Component<{ sideBar?: boolean, noteID?: string | null }> {
  render() {
    const { sideBar, noteID } = this.props;
    return (
      <EditorScroll sideBar={sideBar}>
        <SlateEditor noteID={noteID} />
      </EditorScroll>
    );
  }
}
