// @flow
import React from 'react';
// wrappers to provide shared functionality
import WrapNodeMenu from './Wrappers/NodeMenu';
// nodes are building blocks of document
import NewNoteButton from './Buttons/NewNoteButton';
import NoteList from './Facets/NoteList';
import TextNode from './Documents/Text';

function renderBasicNode(props) {
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
      return <TextNode {...attributes}>{children}</TextNode>;
  }
}

/* eslint-disable react/destructuring-assignment */
export default function renderNodeWithWrapper(value, onChange) {
  return (props: *) => (
    <WrapNodeMenu value={value} onChange={onChange} node={props.node}>
      {renderBasicNode(props)}
    </WrapNodeMenu>
  );
}
