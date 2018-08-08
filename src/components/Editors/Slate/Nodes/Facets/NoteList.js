// @flow
import { take } from 'lodash';
import React, { Component } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import is from 'styled-is';
import { Link } from 'react-router-dom';

import { materialButton } from '../../../../../styles/material';

const Container = styled(Flex)`
  padding-top: 5px;
  margin: auto;
`;
const Title = styled.h3`
  cursor: pointer;
  padding-left: 10px;
`;
const Tags = styled.div`
  padding-left: 3px;

  div[disabled] {
    color: #999;
    opacity: 0.3;
    cursor: no-drop;
    &:hover {
      color: #999;
    }
  }
`;
const NoteLink = styled.button`
  ${materialButton};
  user-select: none;
  width: 100%;
  ${is('focused')`
    border: 1px solid #999;
  `};

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;
const Expander = styled(Flex)`
  cursor: pointer;
  width: 100%;
  height: 30px;
  background-color: #ccc;
  opacity: 0.1;
  &:hover {
    opacity: 0.5;
  }
  margin-top: 10px;
`;

type Props = {
  children: string | Element<any>,
};
type Store = {
  notes: Object[],
  currentNoteID: string | null,
};
type State = {
  expanded: boolean,
};
class NoteList extends Component<Props & Store, State> {
  state = {
    expanded: false,
  };

  displayLimit = 18;

  expandArea = () => this.setState((prevState: State) => ({ expanded: !prevState.expanded }));

  render() {
    const { children, notes, currentNoteID } = this.props;
    const { expanded } = this.state;
    return (
      <Container column>
        <Title onClick={this.expandArea}>{children}</Title>
        <Tags>
          {(expanded ? notes : take(notes, this.displayLimit)).map(({ id, title }) => (
            <Link to={`/note/${id}/`} key={id}>
              <NoteLink focused={id === currentNoteID} contenteditable={false}>
                {title}
              </NoteLink>
            </Link>
          ))}
        </Tags>
        {notes.length > this.displayLimit && (
          <Expander center onClick={this.expandArea}>
            {expanded ? '收起' : '展开'}
          </Expander>
        )}
      </Container>
    );
  }
}

function mapState({ note: { ids, notes, currentNoteID } }): Store {
  return { notes: ids.map(id => notes[id]), currentNoteID };
}

export default connect(mapState)(NoteList);
