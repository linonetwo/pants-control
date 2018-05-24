// @flow
import { take } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flex from 'styled-flex-component';

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
const NoteLink = styled(Flex)`
  cursor: pointer;
  user-select: none;
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
};
type Store = {
  ids: string[],
};
type Dispatch = {
  focusNote: (id: string) => void,
};
class NewNoteButton extends Component<Props & Store & Dispatch, *> {
  state = {
    expanded: false,
  };

  displayLimit = 18;

  expandArea = () => this.setState({ expanded: !this.state.expanded });

  render() {
    return (
      <Container column>
        <Title onClick={this.expandArea}>{this.props.title || this.props.children}</Title>
        <Tags>
          {(this.state.expanded ? this.props.ids : take(this.props.ids, this.displayLimit)).map(id => (
            <NoteLink key={id} onClick={() => this.props.focusNote(id)} contenteditable={false}>
              {id}
            </NoteLink>
          ))}
        </Tags>
        {this.props.ids.length > this.displayLimit && (
          <Expander center onClick={this.expandArea}>
            {this.state.expanded ? '收起' : '展开'}
          </Expander>
        )}
      </Container>
    );
  }
}

function mapState({ note: { ids } }): Store {
  return { ids };
}
function mapDispatch({ note: { focusNote } }): Dispatch {
  return {
    focusNote,
  };
}
export default connect(mapState, mapDispatch)(NewNoteButton);
