// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import { Block, Value } from 'slate';
import Plain from 'slate-plain-serializer';
import equal from 'fast-deep-equal';
import { CHILD_REQUIRED, CHILD_TYPE_INVALID } from 'slate-schema-violations';

import NewNoteButton from './Buttons/NewNoteButton';
import NoteList from './Facets/NoteList';

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

const schema = {
  document: {
    nodes: [{ match: { type: 'title' }, min: 1, max: 1 }, { match: { type: 'paragraph' }, min: 1 }],
    normalize: (change, { code, node, child, index }) => {
      switch (code) {
        case CHILD_TYPE_INVALID: {
          const type = index === 0 ? 'title' : 'paragraph';
          return change.setNodeByKey(child.key, type);
        }
        case CHILD_REQUIRED: {
          const block = Block.create(index === 0 ? 'title' : 'paragraph');
          return change.insertNodeByKey(node.key, index, block);
        }
        default:
          return change;
      }
    },
  },
};

class SlateEditor extends Component<Store & Dispatch & Props, State> {
  state = {
    value: Plain.deserialize(''),
    noteID: null,
  };

  static getDerivedStateFromProps(nextProps: Store & Props, currentState: State) {
    if (
      nextProps.currentNoteInStore &&
      nextProps.currentNoteInStore.content &&
      !equal(nextProps.currentNoteInStore?.content, currentState.value.toJSON())
    ) {
      const value = Value.fromJSON(nextProps.currentNoteInStore.content);
      return { value, noteID: nextProps.noteID };
    }
    return null;
  }

  onChange = ({ value }) => {
    const { setNote } = this.props;
    const { value: prevValue, noteID } = this.state;
    if (value.document !== prevValue.document) {
      // save serialized content to local cache in redux store
      const content = value.toJSON();
      if (noteID) {
        setNote({ note: content, id: noteID });
      }
    }
    this.setState({ value });
  };

  renderNode = props => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'new-note-button':
        return <NewNoteButton>{children}</NewNoteButton>;
      case 'note-list':
        return <NoteList>{children}</NoteList>;
      case 'title':
        return <h2 {...attributes}>{children}</h2>;
      case 'paragraph':
      default:
        return <p {...attributes}>{children}</p>;
    }
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
        return <span>{children}</span>;
    }
  };

  render() {
    const { noteID } = this.props;
    const { value } = this.state;
    return (
      <Fragment>
        {noteID && <HoverMenu value={value} onChange={this.onChange} />}
        <EditorContainer>
          {noteID ? (
            <Editor
              placeholder="你可以用 @ 插入特殊块"
              schema={schema}
              value={value}
              onChange={this.onChange}
              renderMark={this.renderMark}
              renderNode={this.renderNode}
              spellCheck={false}
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
const mapDispatch = ({ note: { setNote } }: *): Dispatch => ({ setNote });
export default connect(mapState, mapDispatch)(SlateEditor);
