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

type Props = {
  currentNote: Object | string,
  currentNoteID: string,
};
type State = {
  value: Object,
};
const mapStateToProps = ({ note: { notes, currentNoteID }, info: { loadingCounter } }) => ({
  currentNote: notes[currentNoteID],
  currentNoteID,
  loadingCounter,
});

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

  deserializeNote(noteContent: string | Object, ID: string) {
    switch (typeof noteContent) {
      case 'string':
        this.setState({ value: Plain.deserialize(noteContent), contentType: 'string' });
        break;
      case 'object':
        this.setState({ value: Value.fromJSON(noteContent), contentType: 'object' });
        break;
      default:
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
          value={this.state.value}
          onChange={this.onChange}
        />
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
