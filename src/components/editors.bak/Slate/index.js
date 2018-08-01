// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import equal from 'fast-deep-equal';

import type { Note } from '../../../store/note';

import HoverMenu from './HoverMenu';
import renderMark from './renderMark';
import renderNode from './renderNode';
import schema from './schema';

const EditorContainer = styled.div``;

type Store = {
  /* eslint-disable react/no-unused-prop-types */
  currentNoteInStore?: Note,
  /* eslint-enable react/no-unused-prop-types */
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
  state = {
    value: Plain.deserialize(''),
    noteID: null,
  };

  static getDerivedStateFromProps(nextProps: Store & Props, currentState: State) {
    if (nextProps.currentNoteInStore && nextProps.currentNoteInStore?.content?.toJSON)
      if (
        nextProps.currentNoteInStore &&
        nextProps.currentNoteInStore?.content?.toJSON &&
        !equal(nextProps.currentNoteInStore.content.toJSON(), currentState.value.toJSON())
      ) {
        return { value: nextProps.currentNoteInStore.content, noteID: nextProps.noteID };
      }
    return null;
  }

  onChange = ({ value }) => {
    const { setNote, noteID, currentNoteInStore } = this.props;
    const { value: prevValue, noteID: prevNoteID } = this.state;
    if (!value.document.equals(prevValue.document)) {
      // save serialized content to local cache in redux store
      if (noteID && prevNoteID && prevNoteID === noteID) {
        setNote({ ...currentNoteInStore, note: value, id: noteID });
      }
    }
    this.setState({ value });
  };

  render() {
    const { noteID, currentNoteInStore } = this.props;
    const { value } = this.state;
    return (
      <Fragment>
        {noteID && <HoverMenu value={value} onChange={this.onChange} />}
        <EditorContainer>
          {noteID ? (
            <Editor
              placeholder="你可以用 @ 插入特殊块"
              schema={currentNoteInStore.type === 'document' ? schema : null}
              value={value}
              onChange={this.onChange}
              renderMark={renderMark}
              renderNode={renderNode(value, this.onChange)}
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
