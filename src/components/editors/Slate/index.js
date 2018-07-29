// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import { Value } from 'slate';
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
              renderMark={renderMark}
              renderNode={renderNode}
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
