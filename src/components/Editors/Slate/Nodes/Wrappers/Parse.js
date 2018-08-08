// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

const Highlight = styled.mark``;

type Props = {
  children: string | Object,
  node: Object,
};
export default class Parse extends Component<Props> {
  render() {
    const { children, node } = this.props;
    console.log(node.text)
    return <Highlight>{children}</Highlight>;
  }
}
