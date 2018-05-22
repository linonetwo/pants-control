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
  margin: 10px 300px;
`;

type Store = {
  currentNote: Object | string,
  currentNoteID: string,
};
type Dispatch = {
  setNote: ({ note: string, id: string }) => void,
};
type State = {
  value: Object,
};

class SlateEditor extends Component<Store & Dispatch, State> {
  /** Note switching: load new note from store
   * noteID is the content multihash in the IPFS.
   */
  static getDerivedStateFromProps(nextProps: Store) {
    if (nextProps.currentNoteID !== this.props.currentNoteID) {
      return { value: Value.fromJSON(nextProps.currentNote) };
    }
    return null;
  }

  state = {
    value: Plain.deserialize('This is editable plain text.\nJust like a <textarea>!'),
  };

  /** Initialization: load note from store
   * Some public data like profile should be a plain JSON-LD, so we load it as a string.
   * Others are rich text, load it as standard Slate value.
   */
  componentWillMount() {
    const { currentNote } = this.props;
    this.setState({ value: Value.fromJSON(currentNote) });
  }

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
        <EditorContainer>
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
  currentNote: notes[currentNoteID].content,
  currentNoteID,
});
const mapDispatch = ({ note: { setNote } }): Dispatch => ({ setNote });
export default connect(mapStateTo, mapDispatch)(SlateEditor);
