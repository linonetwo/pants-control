// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import Editors from '../../components/Editors';

const Header = styled.header`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const HeaderTitle = styled.h1`
  font-size: 14px;
`;
const Container = styled(Grid)`
  height: 100vh;
  width: 100vw;
`;
type Store = {
  currentNoteID: string | null,
  sideNoteID: string | null,
};
class NoteBook extends Component<Store, *> {
  state = {
    leftNoteWidth: 3,
    noteAreaWidth: 12,
  };
  render() {
    return (
      <Container columns={this.state.noteAreaWidth}>
        <Cell width={this.state.leftNoteWidth}>
          <Editors sideBar noteID={this.props.sideNoteID} />
        </Cell>
        <Cell width={this.state.noteAreaWidth - this.state.leftNoteWidth}>
          <Header>
            <HeaderTitle>Welcome to Pants-Control</HeaderTitle>
          </Header>
          <Editors noteID={this.props.currentNoteID} />
        </Cell>
      </Container>
    );
  }
}

const mapState = ({ note: { currentNoteID, sideNoteID } }): Store => ({
  currentNoteID,
  sideNoteID,
});
export default connect(mapState)(NoteBook);
