// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Plain from 'slate-plain-serializer';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import { Value } from 'slate';

import HoverMenu from './HoverMenu';
import { loadNote } from '../../../store/actions/core';

const EditorContainer = styled.div`
  /* providing margin */
  margin: 10px 300px;
`;

type Props = {
  currentNote: Object | string,
  currentNoteID: string,
  loadNote: ({ hash: string }) => void,
};
type State = {
  value: Object,
};
const mapStateToProps = ({ note: { notes, currentNoteID } }) => ({ currentNote: notes[currentNoteID], currentNoteID });

@connect(mapStateToProps, { loadNote })
export default class SlateEditor extends Component<Props, State> {
  state = {
    value: Plain.deserialize('This is editable plain text.\nJust like a <textarea>!'),
    contentType: 'object',
  };

  /** Initialization: load note from store
   * Some public data like profile should be a plain JSON-LD, so we load it as a string.
   * Others are rich text, load it as standard Slate value.
   */
  componentWillMount() {
    const { currentNote, currentNoteID } = this.props;
    this.deserializeNote(currentNote, currentNoteID);
  }

  /** Note switching: load new note from store
   * noteID is the content multihash in the IPFS.
   */
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.currentNoteID !== this.props.currentNoteID) {
      this.deserializeNote(nextProps.currentNote, nextProps.currentNoteID);
    }
  }

  deserializeNote(noteContent: string | Object, hash: string) {
    switch (typeof noteContent) {
      case 'string':
        this.setState({ value: Plain.deserialize(noteContent), contentType: 'string' });
        break;
      case 'object':
        this.setState({ value: Value.fromJSON(noteContent), contentType: 'object' });
        break;
      default:
        this.props.loadNote({ hash });
        this.setState({ value: Plain.deserialize('Note loading...'), contentType: 'string' });
        break;
    }
  }

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      // save serialized content to local cache in redux store
      if (this.state.contentType === 'string') {
        const content = Plain.serialize(value);
      } else {
        const content = JSON.stringify(value.toJSON());
      }
    }
    // save content to fast local cache in react state
    this.setState({ value });
  };

  /**
   * Update the menu's absolute position.
   */
  updateMenu = () => {
    const { value } = this.state;
    if (!this.menu) return;

    if (value.isBlurred || value.isEmpty) {
      return {};
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const top = `${rect.top + window.scrollY - this.menu.offsetHeight}px`;
    const left = `${rect.left + window.scrollX - this.menu.offsetWidth / 2 + rect.width / 2}px`;
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
