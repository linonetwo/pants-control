// @flow
import { size } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';
import { Icon, Spin, Button } from 'antd';

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
  profile: Object,
};
type Props = {
  history: Object,
};
class NoteBook extends Component<Store & Props, *> {
  state = {
    leftNoteWidth: 3,
    noteAreaWidth: 12,
  };

  static getDerivedStateFromProps(nextProps: Store) {
    if (!nextProps.sideNoteID) {
      return { leftNoteWidth: 0 };
    }
    return {
      leftNoteWidth: 3,
    };
  }

  render() {
    const { sideNoteID, currentNoteID, syncing, allNoteSynced, profile, history } = this.props;
    const { noteAreaWidth, leftNoteWidth } = this.state;
    return (
      <Container columns={noteAreaWidth}>
        {sideNoteID && (
          <Cell width={leftNoteWidth}>
            <Editors sideBar noteID={sideNoteID} />
          </Cell>
        )}
        <Cell width={noteAreaWidth - leftNoteWidth}>
          <Header>
            <HeaderTitle>
              欢迎使用内裤管理系统{' '}
              {!syncing &&
                !allNoteSynced && (
                  <small>
                    <Icon type="loading" style={{ fontSize: 14 }} spin />待保存
                  </small>
                )}
              {allNoteSynced && (
                <small>
                  <Icon type="check" style={{ fontSize: 14 }} />已保存
                </small>
              )}
              {size(profile) === 0 &&
                currentNoteID && (
                  <Button size="small" icon="user" onClick={() => history.push(`/?note=${currentNoteID}`)}>
                    登录
                  </Button>
                )}
            </HeaderTitle>
          </Header>
          <Editors noteID={currentNoteID} />
        </Cell>
      </Container>
    );
  }
}

const mapState = ({ note: { currentNoteID, sideNoteID, notSyncedNoteIDs }, viewer: { profile }, loading }): Store => ({
  syncing: loading.effects.note.saveNote,
  allNoteSynced: notSyncedNoteIDs.length === 0,
  currentNoteID,
  sideNoteID,
  profile,
});
export default connect(mapState)(NoteBook);
