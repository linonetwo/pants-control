// @flow
import React, { Component, Fragment } from 'react';
import Plain from 'slate-plain-serializer';
import { isKeyHotkey } from 'is-hotkey';
import styled from 'react-emotion/macro';
import { Editor } from 'slate-react';
import { Value } from 'slate';

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
const EditorContainer = styled.div`
  /* providing margin */
  margin: 10px 300px;
`

class Menu extends Component {
  /**
   * Check if the current selection has a mark with `type` in it.
   */
  hasMark(type: string): boolean {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type == type);
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

export default class SlateEditor extends Component {
  state = {
    value: Plain.deserialize('This is editable plain text.\nJust like a <textarea>!'),
    menu: {
      opacity: undefined,
      top: undefined,
      left: undefined,
    },
  };

  /**
   * Update the menu's absolute position.
   */
  updateMenu = () => {
    const { value } = this.state;
    const menu = this.menu;
    if (!menu) return;

    if (value.isBlurred || value.isEmpty) {
      return {};
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    const left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`;
    return {
      opacity: 1,
      top,
      left,
    };
  };

  /**
   * On change.
   *
   * @param {Change} change
   */
  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return (
      <Fragment>
        <Menu
          {...this.updateMenu()}
          menuRef={menu => {
            this.menu = menu;
          }}
          value={this.state.value}
          onChange={this.onChange}
        />
        <EditorContainer>
          <Editor
            placeholder="你可以用 @ 插入特殊块"
            value={this.state.value}
            onChange={this.onChange}
            renderMark={this.renderMark}
          />
        </EditorContainer>
      </Fragment>
    );
  }

  renderMark = props => {
    const { children, mark } = props;
    switch (mark.type) {
      case 'bold':
        return <strong>{children}</strong>;
      case 'code':
        return <code>{children}</code>;
      case 'italic':
        return <em>{children}</em>;
      case 'underlined':
        return <u>{children}</u>;
    }
  };
}
