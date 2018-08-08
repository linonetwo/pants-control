// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import styled from 'styled-components';
import { Popover, Input, Menu, Icon } from 'antd';

const menuSize = 25;
const MenuButton = styled.div`
  width: ${menuSize}px;
  height: ${menuSize}px;
  text-align: center;
  border-radius: 2px;

  position: absolute;
  left: ${-(menuSize + 10)}px;
  top: 5px;

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
  value: { change: Function },
  node: Object,
  onChange: Function,
  children: string | Element<any>,
};
export default class NodeMenu extends Component<Props> {
  menuSearch = <Input.Search placeholder="现在还用不了，以后可以过滤菜单" onSearch={value => console.log(value)} />;

  /**
   * When a mark button is clicked, toggle the current mark.
   */
  onClickNodeType(type: string) {
    const { value, onChange, node } = this.props;
    const change = value.change().setNodeByKey(node.key, type);
    onChange(change);
  }

  /**
   * Render a mark-toggling toolbar button.
   */
  renderNodeButton(type: string, icon: string): React$Element<*> {
    return (
      <Menu.Item key={type} onClick={() => this.onClickNodeType(type)}>
        <span>
          <Icon type={icon} />
          <span>{type}</span>
        </span>
      </Menu.Item>
    );
  }

  menu = (
    <Menu mode="vertical">
      <Menu.SubMenu
        key="node-type"
        title={
          <span>
            <Icon type="appstore" />
            <span>节点类型</span>
          </span>
        }
      >
        <Menu.ItemGroup title="文档">{this.renderNodeButton('paragraph', 'file-word')}</Menu.ItemGroup>
        <Menu.ItemGroup title="索引">{this.renderNodeButton('note-list', 'bars')}</Menu.ItemGroup>
        <Menu.ItemGroup title="按钮">{this.renderNodeButton('new-note-button', 'file-add')}</Menu.ItemGroup>
      </Menu.SubMenu>
    </Menu>
  );

  render() {
    const { children } = this.props;
    if (!children) return null;
    return (
      <Container>
        <Popover content={this.menu} title={this.menuSearch} trigger="click">
          <MenuButton role="button" tabindex="0" contenteditable={false}>
            <span className="material-icons">drag_indicator</span>
          </MenuButton>
        </Popover>
        {children}
      </Container>
    );
  }
}
