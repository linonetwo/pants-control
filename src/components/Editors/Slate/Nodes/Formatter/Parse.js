// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

const Highlight = styled.mark``;

type Props = {
  children: string | Object,
  node: Object,
};
type State = {
  text: string,
  tags: Object[],
};
export default class Parse extends Component<Props, State> {
  state = {
    text: '',
    tags: [],
  };

  static getDerivedStateFromProps(nextProps: Props, state: State) {
    if (nextProps.node.text !== state.text) {
      console.log(nextProps.node.text);
      return {
        text: nextProps.node.text,
      };
    }
  }

  render() {
    const { children } = this.props;
    return <Highlight>{children}</Highlight>;
  }
}
