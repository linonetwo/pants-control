// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import styled from 'styled-components';

const menuSize = 20;
const MenuButton = styled.div`
  width: ${menuSize}px;
  height: ${menuSize}px;
  text-align: center;

  background-color: whitesmoke;

  position: absolute;
  left: -26px;
  top: calc((100% - ${menuSize}px) / 2);

  cursor: grab;
  user-select: none;

  span {
    color: lightslategray;
    font-size: ${menuSize - 2}px;
  }

  transition: opacity 600ms cubic-bezier(0.215, 0.61, 0.355, 1);
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: relative;

  &:hover {
    ${MenuButton} {
      opacity: 1;
    }
  }
`;

type Props = {
  children: string | Element<any>,
};
export default class NodeMenu extends Component<Props> {
  render() {
    const { children } = this.props;
    return (
      <Container>
        <MenuButton role="button" tabindex="0">
          <span className="material-icons">menu</span>
        </MenuButton>
        {children}
      </Container>
    );
  }
}
