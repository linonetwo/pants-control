// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import styled from 'styled-components';
import { Popover, Input } from 'antd';

const menuSize = 25;
const MenuButton = styled.div`
  width: ${menuSize}px;
  height: ${menuSize}px;
  text-align: center;
  border-radius: 2px;

  position: absolute;
  left: ${-(menuSize + 10)}px;
  top: calc((100% - ${menuSize}px) / 2);

  cursor: grab;
  user-select: none;

  span {
    color: gray;
    font-size: ${menuSize}px;
  }

  transition: all 600ms cubic-bezier(0.215, 0.61, 0.355, 1);
  opacity: 0;
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.1);
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
  menuSearch = <Input.Search placeholder="input search text" onSearch={value => console.log(value)} />;

  menu = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  render() {
    const { children } = this.props;
    return (
      <Container>
        <Popover content={this.menu} title={this.menuSearch} trigger="click">
          <MenuButton role="button" tabindex="0" contenteditable={false}>
            <span className="material-icons">menu</span>
          </MenuButton>
        </Popover>
        {children}
      </Container>
    );
  }
}
