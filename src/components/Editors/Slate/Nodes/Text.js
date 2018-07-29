// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import styled from 'styled-components';

const TextContainer = styled.p``;

type Dispatch = {};
type Props = {
  children: string | Element<any>,
};
export default class Text extends Component<Dispatch & Props> {
  render() {
    const { children } = this.props;
    return <TextContainer>{children}</TextContainer>;
  }
}
