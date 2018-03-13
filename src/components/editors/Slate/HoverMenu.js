// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import ReactDOM from 'react-dom';

const MenuButton = styled.span`
  color: ${props => (props.isActive ? '#fff' : '#aaa')};
  cursor: pointer;

  & .material-icons {
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
  opacity: ${props => props.opacity || 0};
  top: ${props => props.top || '-10000px'};
  left: ${props => props.left || '-10000px'};

  /* margin between buttons */
  & > span {
    display: inline-block;
  }
  & > span + span {
    margin-left: 15px;
  }
`;

export default class HoverMenu extends Component {
  /**
   * Check if the current selection has a mark with `type` in it.
   */
  hasMark(type: string): boolean {
    const { value } = this.props;
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
  renderMarkButton(type: string, icon: string): Element {
    const isActive = this.hasMark(type);

    return (
      <MenuButton onMouseDown={event => this.onClickMark(event, type)} isActive={isActive}>
        <span className="material-icons">{icon}</span>
      </MenuButton>
    );
  }

  render() {
    const { opacity, top, left } = this.props;
    return ReactDOM.createPortal(
      <MenuContainer opacity={opacity} top={top} left={left} innerRef={this.props.menuRef}>
        {this.renderMarkButton('bold', 'format_bold')}
        {this.renderMarkButton('italic', 'format_italic')}
        {this.renderMarkButton('underlined', 'format_underlined')}
        {this.renderMarkButton('code', 'code')}
      </MenuContainer>,
      document.getElementById('root'),
    );
  }
}
