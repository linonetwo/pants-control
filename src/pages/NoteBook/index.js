// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';
import Flex from 'styled-flex-component';

import Editors from '../../components/Editors';

const headerHeight = '50px';
const Header = styled.header`
  position: absolute;
  top: 0;
  height: ${headerHeight};
`;
const Container = styled(Flex)`
  height: calc(100vh - ${headerHeight});
  margin-top: ${headerHeight};
  width: 100vw;
`;
class NoteBook extends Component<*> {
  state = {
    leftNoteWidth: 3,
    noteAreaWidth: 12,
  };
  render() {
    return (
      <Fragment>
        <Header>
          <h1>Welcome to Pants-Control</h1>
        </Header>
        <Container>
          <Grid columns={this.state.noteAreaWidth}>
            <Cell width={this.state.leftNoteWidth}>
              <Editors />
            </Cell>
            <Cell width={this.state.noteAreaWidth - this.state.leftNoteWidth}>
              <Editors margin/>
            </Cell>
          </Grid>
        </Container>
      </Fragment>
    );
  }
}

export default connect(() => ({}))(NoteBook);
