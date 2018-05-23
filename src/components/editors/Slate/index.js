// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Plain from 'slate-plain-serializer';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import { Value } from 'slate';

import HoverMenu from './HoverMenu';

const EditorContainer = styled.div`
  /* providing margin */
  margin: 10px ${({ margin }) => (margin ? '300px' : '10px')};
`;

type Store = {
  currentNote?: string | null,
  currentNoteID: string | null,
};
type Dispatch = {
  setNote: ({ note: string, id: string }) => void,
};
type Props = {
  margin?: boolean,
};
type State = {
  value: Object,
  currentNoteID: string | null,
};

class SlateEditor extends Component<Store & Dispatch & Props, State> {
  /** Note switching: load new note from store
   * noteID is the content multihash in the IPFS.
   */
  /** Initialization: load note from store
   * Some public data like profile should be a plain JSON-LD, so we load it as a string.
   * Others are rich text, load it as standard Slate value.
   */
  static getDerivedStateFromProps(nextProps: Store, currentState: State) {
    if (nextProps.currentNoteID !== currentState.currentNoteID && nextProps.currentNote) {
      return { value: Value.fromJSON(JSON.parse(nextProps.currentNote)), currentNoteID: nextProps.currentNoteID };
    }
    return null;
  }

  state = {
    value: Plain.deserialize('This is editable plain text.\nJust like a <textarea>!'),
    currentNoteID: null,
  };

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      // save serialized content to local cache in redux store

      const content = JSON.stringify(value.toJSON());
      this.props.setNote({ note: content, id: this.props.currentNoteID });
    }
    // save content to fast local cache in react state
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
      default:
        return <p>{children}</p>;
    }
  };

  render() {
    return (
      <Fragment>
        <HoverMenu value={this.state.value} onChange={this.onChange} />
        <EditorContainer margin={this.props.margin}>
          {this.props.currentNote ? (
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

const mapStateTo = ({ note: { notes, currentNoteID } }): Store => ({
  currentNote: notes[currentNoteID]?.content,
  currentNoteID,
});
const mapDispatch = ({ note: { setNote } }): Dispatch => ({ setNote });
export default connect(mapStateTo, mapDispatch)(SlateEditor);
