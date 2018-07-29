// @flow
import { take } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import is from 'styled-is';
import { Link } from 'react-router-dom';

import { materialButton } from '../../styles/material';

const Container = styled(Flex)`
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
  title?: string,
  children: string | React$Element<*>,
};
type Store = {
  ids: string[],
  currentNoteID: string | null,
};
type State = {
  expanded: boolean,
};
class NewNoteButton extends Component<Props & Store, State> {
  state = {
    expanded: false,
  };

  displayLimit = 18;

  expandArea = () => this.setState((prevState: State) => ({ expanded: !prevState.expanded }));

  render() {
    const { title, children, ids, currentNoteID } = this.props;
    const { expanded } = this.state;
    return (
      <Container column>
        <Title onClick={this.expandArea}>{title || children}</Title>
        <Tags>
          {(expanded ? ids : take(ids, this.displayLimit)).map(id => (
            <Link to={`/note/${id}/`}>
              <NoteLink focused={id === currentNoteID} key={id} contenteditable={false}>
                {id}
              </NoteLink>
            </Link>
          ))}
        </Tags>
        {ids.length > this.displayLimit && (
          <Expander center onClick={this.expandArea}>
            {expanded ? '收起' : '展开'}
          </Expander>
        )}
      </Container>
    );
  }
}

function mapState({ note: { ids, currentNoteID } }): Store {
  return { ids, currentNoteID };
}

export default connect(mapState)(NewNoteButton);
