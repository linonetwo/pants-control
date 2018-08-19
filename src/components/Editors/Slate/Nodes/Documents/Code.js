// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import styled from 'styled-components';

const CodeContainer = styled.article`
  padding: 7px;
  background-color: #f6f8fa;

  pre {
    margin: 0;
    font-family: 'Fira Code', Consolas, monospace;
  }
`;

type Props = {
  children: string | Element<any>,
};
export default class Code extends Component<Props> {
  render() {
    const { children } = this.props;
    return <CodeContainer>{children}</CodeContainer>;
  }
}
