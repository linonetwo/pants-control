// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import Ink from 'react-ink';
import uuid from 'uuid/v4';

import { materialButton } from '../../../../../styles/material';

const ButtonContainer = styled(Flex)`
  ${materialButton};
`;

type Dispatch = {
  saveNewNoteFromString: ({ id: string, note: string }) => void,
};
type Props = {
  children: string | Element<any>,
};
class NewNoteButton extends Component<Dispatch & Props> {
  render() {
    const { saveNewNoteFromString, children } = this.props;
    return (
      <ButtonContainer onClick={() => saveNewNoteFromString({ id: uuid(), note: '', title: '新笔记' })}>
        <Ink />
        {children}
      </ButtonContainer>
    );
  }
}

function mapDispatch({ note: { saveNewNoteFromString } }: *): Dispatch {
  return {
    saveNewNoteFromString,
  };
}
export default connect(undefined, mapDispatch)(NewNoteButton);
