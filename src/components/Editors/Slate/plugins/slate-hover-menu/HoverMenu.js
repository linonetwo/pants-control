// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import ReactDOM from 'react-dom';

/**
 * Check if the current selection has a mark with `type` in it.
 */
export function hasMarkOrInline(type: string, value): boolean {
  let has = false;
  if (value.activeMarks) {
    has = value.activeMarks.some(mark => mark.type === type);
  }
  if (value.inlines) {
    has = has || value.inlines.some(inline => inline.type === type);
  }
  return has;
}

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
   * When a mark button is clicked, toggle the current mark.
   */
  onClickMark(event: SyntheticEvent<HTMLButtonElement>, button: { type: string, icon: string }) {
    event.preventDefault();
    event.stopPropagation();
    const { value, onChange, onButtonClicked } = this.props;
    onButtonClicked(value, onChange, button);
  }

  /**
   * Render a mark-toggling toolbar button.
   */
  renderMarkButton(button: { type: string, icon: string }, value): React$Element<*> {
    return (
      <MenuButton
        key={button.type}
        onMouseDown={event => this.onClickMark(event, button)}
        active={hasMarkOrInline(button.type, value)}
      >
        <span className="material-icons">{button.icon}</span>
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
      const { buttons, value } = this.props;
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
          {buttons.map(button => this.renderMarkButton(button, value))}
        </MenuContainer>,
        mountPoint,
      );
    }
    return null;
  }
}
