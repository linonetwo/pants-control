// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import styled from 'styled-components';

const CodeContainer = styled.article`
  padding-top: 7px;
  background-color: #ccc;
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
