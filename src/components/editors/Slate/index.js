// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import equal from 'fast-deep-equal';
import NewNoteButton from '../../Buttons/NewNoteButton';
import NoteList from '../../Facets/NoteList';

import type { Note } from '../../../store/note';

import HoverMenu from './HoverMenu';

const EditorContainer = styled.div``;

type Store = {
  currentNoteInStore?: Note,
};
type Dispatch = {
  setNote: ({ note: string, id: string }) => void,
};
type Props = {
  noteID?: string | null,
};
type State = {
  noteID?: string | null,
  value: Object,
};

class SlateEditor extends Component<Store & Dispatch & Props, State> {
  static getDerivedStateFromProps(nextProps: Store & Props, currentState: State) {
    if (
      nextProps.currentNoteInStore?.content &&
      !equal(nextProps.currentNoteInStore?.content, currentState.value.toJSON())
    ) {
      const value = Value.fromJSON(nextProps.currentNoteInStore.content);
      return { value, noteID: nextProps.noteID };
    }
    return null;
  }

  state = {
    value: Plain.deserialize(''),
    noteID: null,
  };

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      // save serialized content to local cache in redux store
      const content = value.toJSON();
      if (this.state.noteID) {
        this.props.setNote({ note: content, id: this.state.noteID });
      }
    }
    this.setState({ value });
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
      case 'new-note-button':
        return <NewNoteButton>{children}</NewNoteButton>;
      case 'note-list':
        return <NoteList>{children}</NoteList>;
      default:
        return <p>{children}</p>;
    }
  };

  render() {
    return (
      <Fragment>
        {this.props.noteID && <HoverMenu value={this.state.value} onChange={this.onChange} />}
        <EditorContainer>
          {this.props.noteID ? (
            <Editor
              placeholder="你可以用 @ 插入特殊块"
              value={this.state.value}
              onChange={this.onChange}
              renderMark={this.renderMark}
            />
          ) : (
            'Loading...'
          )}
        </EditorContainer>
      </Fragment>
    );
  }
}

const mapState = ({ note: { notes } }, { noteID }): Store => ({
  currentNoteInStore: notes[noteID],
});
const mapDispatch = ({ note: { setNote } }): Dispatch => ({ setNote });
export default connect(mapState, mapDispatch)(SlateEditor);
