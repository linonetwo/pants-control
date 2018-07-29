// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';

import ReactDOM from 'react-dom';

const MenuButton = styled.span`
  cursor: pointer;

  & .material-icons {
    color: #aaa;
    color: ${is('active')`#fff`};
    font-size: 18px;
    vertical-align: text-bottom;
  }
`;
const MenuContainer = styled.div`
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  margin-top: -6px;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;
  opacity: ${({ opacity }) => opacity || 0};
  top: ${({ top }) => top || '-10000px'};
  left: ${({ left }) => left || '-10000px'};

  /* margin between buttons */
  & > span {
    display: inline-block;
  }
  & > span + span {
    margin-left: 15px;
  }
`;

export default class HoverMenu extends Component<*> {
  menuRef = null;

  /**
   * Check if the current selection has a mark with `type` in it.
   */
  hasMark(type: string): boolean {
    const { value } = this.props;

    if (!value.activeMarks) return false;
    return value.activeMarks.some(mark => mark.type === type);
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   */
  onClickMark(event: SyntheticEvent<HTMLButtonElement>, type: string) {
    event.preventDefault();
    const { value, onChange } = this.props;
    const change = value.change().toggleMark(type);
    onChange(change);
  }

  /**
   * Render a mark-toggling toolbar button.
   */
  renderMarkButton(type: string, icon: string): React$Element<*> {
    return (
      <MenuButton onMouseDown={event => this.onClickMark(event, type)} active={this.hasMark(type)}>
        <span className="material-icons">{icon}</span>
      </MenuButton>
    );
  }

  getMenuStyle = () => {
    const { value } = this.props;
    const selection = window.getSelection();
    if (this.menuRef !== null && selection.rangeCount > 0 && !value.isBlurred && !value.isCollapsed) {
      const { offsetHeight, offsetWidth } = this.menuRef;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const top = `${rect.top + window.scrollY - offsetHeight}px`;
      const left = `${rect.left + window.scrollX - offsetWidth / 2 + rect.width / 2}px`;

      return {
        opacity: 1,
        top,
        left,
      };
    }
    return {};
  };

  render() {
    const { opacity, top, left } = this.getMenuStyle();
    const mountPoint = document.getElementById('root');
    if (mountPoint) {
      return ReactDOM.createPortal(
        <MenuContainer
          opacity={opacity}
          top={top}
          left={left}
          innerRef={elem => {
            this.menuRef = elem;
          }}
        >
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderMarkButton('new-note-button', 'add')}
          {this.renderMarkButton('note-list', 'view_list')}
        </MenuContainer>,
        mountPoint,
      );
    }
    return null;
  }
}
