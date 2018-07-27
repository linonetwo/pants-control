// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';
import { Icon, Spin } from 'antd';

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
  syncing: boolean,
  allNoteSynced: boolean,
  currentNoteID: string | null,
  sideNoteID: string | null,
};
class NoteBook extends Component<Store, *> {
  state = {
    leftNoteWidth: 3,
    noteAreaWidth: 12,
  };

  render() {
    const { sideNoteID, currentNoteID, syncing, allNoteSynced } = this.props;
    console.log(syncing)
    const { noteAreaWidth, leftNoteWidth } = this.state;
    return (
      <Container columns={noteAreaWidth}>
        <Cell width={leftNoteWidth}>
          <Editors sideBar noteID={sideNoteID} />
        </Cell>
        <Cell width={noteAreaWidth - leftNoteWidth}>
          <Header>
            <HeaderTitle>
              欢迎使用内裤管理系统{' '}
              {syncing && (
                <span>
                  <Spin indicator={<Icon type="loading" style={{ fontSize: 14 }} spin />} />保存中
                </span>
              )}
              {allNoteSynced && (
                <small>
                  <Icon type="check" style={{ fontSize: 14 }} />已保存
                </small>
              )}
            </HeaderTitle>
          </Header>
          <Editors noteID={currentNoteID} />
        </Cell>
      </Container>
    );
  }
}

const mapState = ({ note: { currentNoteID, sideNoteID, notSyncedNoteIDs }, loading }): Store => ({
  syncing: !!loading.effects.note.saveNote,
  allNoteSynced: notSyncedNoteIDs.length === 0,
  currentNoteID,
  sideNoteID,
});
export default connect(mapState)(NoteBook);
