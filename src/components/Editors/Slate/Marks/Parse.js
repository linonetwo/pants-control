// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

const Highlight = styled.mark``;

type Props = {
  children: string | Object,
};
export default class Parse extends Component<Props> {
  render() {
    const { children, text } = this.props;
    console.log(text)
    return <Highlight>{children}</Highlight>;
  }
}
