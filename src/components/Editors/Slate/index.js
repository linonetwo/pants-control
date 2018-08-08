// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import equal from 'fast-deep-equal';

import type { Note } from '../../../store/note';

import renderMark from './Marks/renderMark';
import renderNode from './Nodes/renderNode';
import getSchema from './schemas';
import HoverMenuPlugin from './plugins/slate-hover-menu';
import SuggestNodeChangePlugin from './plugins/slate-suggest-node-change';

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
  constructor(props) {
    super(props);

    const suggestNodeChangePlugin = SuggestNodeChangePlugin({
      suggestions: [
        {
          key: 'title标题biaoti',
          value: 'title',
          display: 'Title',
        },
        {
          key: 'paragraph段落duanluo',
          value: 'paragraph',
          display: 'Paragraph',
        },
        {
          key: 'note-list节点列表jiedianliebiao',
          value: 'note-list',
          display: 'NoteList',
        },
        {
          key: 'new-note-button新笔记按钮xinbijianniu',
          value: 'new-note-button',
          display: 'NewNoteButton',
        },
      ],
    });
    const hoverMenuPlugin = HoverMenuPlugin({
      buttons: [
        { type: 'bold', icon: 'format_bold' },
        { type: 'italic', icon: 'format_italic' },
        { type: 'underlined', icon: 'format_underlined' },
        { type: 'code', icon: 'code' },
        { type: 'parse', icon: 'power_input' },
      ],
    });
    this.plugins = [suggestNodeChangePlugin, hoverMenuPlugin];
  }

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
        <EditorContainer>
          {noteID ? (
            <Editor
              plugins={this.plugins}
              placeholder="你可以用 @ 插入特殊块"
              schema={getSchema(currentNoteInStore.type)}
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
