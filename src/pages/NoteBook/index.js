// @flow
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
`;
class NoteBook extends Component<*> {
  render() {
    return;
    <Fragment>
      <Header>
        <h1>Welcome to Pants-Control</h1>
      </Header>
      <Container>
        <Editors />
      </Container>
    </Fragment>;
  }
}
