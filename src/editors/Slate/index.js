// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Plain from 'slate-plain-serializer';
import styled from 'react-emotion/macro';
import { Editor } from 'slate-react';

import HoverMenu from './HoverMenu';

const EditorContainer = styled.div`
  /* providing margin */
  margin: 10px 300px;
`;

const mapStateToProps = store => ({
  currentNote: store.note.notes[store.note.currentNoteID],
  noteID: store.note.currentNoteID,
});
type Props = {
  currentNote?: Object,
  noteID?: string,
};
type State = {
  value: Object,
};
@connect(mapStateToProps)
export default class SlateEditor extends Component<Props, State> {
  state = {
    value: Plain.deserialize('This is editable plain text.\nJust like a <textarea>!'),
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.currentNote);
    if (nextProps.noteID !== this.props.noteID) {
      // this.setState({ value: nextProps.currentNote });
    }
  }

  onChange = ({ value }) => {
    this.setState({ value });
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
      default:
        return <p>{children}</p>;
    }
  };

  render() {
    return (
      <Fragment>
        <HoverMenu
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
}
