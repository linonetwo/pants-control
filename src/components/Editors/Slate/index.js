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
import SuggestionsPlugin from './plugins/slate-suggestions';

const suggestions = [
  {
    key: 'Jon Snow',
    value: '@Jon Snow',
    display: '@Jon Snow', // Can be either string or react component
  },
  {
    key: 'John Evans',
    value: '@John Evans',
    display: '@John Evans',
  },
  {
    key: 'Daenerys Targaryen',
    value: '@Daenerys Targaryen',
    display: '@Daenerys Targaryen',
  },
  {
    key: 'Cersei Lannister',
    value: '@Cersei Lannister',
    display: '@Cersei Lannister',
  },
  {
    key: 'Tyrion Lannister',
    value: '@Tyrion Lannister',
    display: '@Tyrion Lannister',
  },
];
function getCurrentWord(text, index, initialIndex) {
  if (index === initialIndex) {
    return { start: getCurrentWord(text, index - 1, initialIndex), end: getCurrentWord(text, index + 1, initialIndex) };
  }
  if (text[index] === ' ' || text[index] === '@' || text[index] === undefined) {
    return index;
  }
  if (index < initialIndex) {
    return getCurrentWord(text, index - 1, initialIndex);
  }
  if (index > initialIndex) {
    return getCurrentWord(text, index + 1, initialIndex);
  }
}

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

    // setup slate plugins
    const suggestionsPlugin = SuggestionsPlugin({
      trigger: '@',
      regex: /@([\w]*)/,
      suggestions,
      onEnterSuggestion: (suggestion, change, onChange) => {
        if (!change?.value) return null;
        const { anchorText, selection } = change.value;
        const anchorOffset = selection.anchor.offset;
        const { text } = anchorText;

        let index = { start: anchorOffset - 1, end: anchorOffset };

        if (text[anchorOffset - 1] !== '@') {
          index = getCurrentWord(text, anchorOffset - 1, anchorOffset - 1);
        }

        const newText = `${text.substring(0, index.start)}${suggestion.value} `;

        onChange(change.deleteBackward(anchorOffset).insertText(newText));

        return true;
      },
    });
    const { Suggestions } = suggestionsPlugin;
    this.Suggestions = Suggestions;
    this.plugins = [suggestionsPlugin];
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
    const { plugins, Suggestions } = this;
    return (
      <Fragment>
        {noteID && <HoverMenu value={value} onChange={this.onChange} />}
        {noteID && <Suggestions value={value} onChange={this.onChange} />}
        <EditorContainer>
          {noteID ? (
            <Editor
              plugins={plugins}
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
