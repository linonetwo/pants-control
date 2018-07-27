// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import Editors, { headerHeight } from '../../components/Editors';

const Header = styled.header`
  height: ${headerHeight};
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
    const { sideNoteID, currentNoteID } = this.props;
    const { noteAreaWidth, leftNoteWidth } = this.state;
    return (
      <Container columns={noteAreaWidth}>
        <Cell width={leftNoteWidth}>
          <Editors sideBar noteID={sideNoteID} />
        </Cell>
        <Cell width={noteAreaWidth - leftNoteWidth}>
          <Header>
            <HeaderTitle>Welcome to Pants-Control</HeaderTitle>
          </Header>
          <Editors noteID={currentNoteID} />
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
