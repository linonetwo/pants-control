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
      <MenuButton key={type} onMouseDown={event => this.onClickMark(event, type)} active={this.hasMark(type)}>
        <span className="material-icons">{icon}</span>
      </MenuButton>
    );
  }

  getMenuStyle = () => {
    const { value } = this.props;
    const selection = window.getSelection();
    if (this.menuRef !== null && selection.rangeCount > 0 && !value.isBlurred && !value.isEmpty) {
      const { offsetHeight, offsetWidth } = this.menuRef;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      return {
        opacity: 1,
        top: `calc(${rect.top}px + ${window.scrollY}px - ${offsetHeight}px - 6px)`,
        left: `calc(${rect.left}px + ${window.scrollX}px - ${offsetWidth / 2}px + ${rect.width / 2}px)`,
      };
    }
    return {};
  };

  render() {
    const { opacity, top, left } = this.getMenuStyle();
    const mountPoint = document.getElementById('root');
    if (mountPoint) {
      const { buttons } = this.props;
      return ReactDOM.createPortal(
        <MenuContainer
          data-usage="slate-hover-menu-plugin"
          opacity={opacity}
          top={top}
          left={left}
          innerRef={elem => {
            this.menuRef = elem;
          }}
        >
          {buttons.map(({ type, icon }) => this.renderMarkButton(type, icon))}
        </MenuContainer>,
        mountPoint,
      );
    }
    return null;
  }
}
