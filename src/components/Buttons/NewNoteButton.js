// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import Ink from 'react-ink';
import Plain from 'slate-plain-serializer';
import uuid from 'uuid/v4';

import { materialButton } from '../../styles/material';

const ButtonContainer = styled(Flex)`
  ${materialButton};
`;

class NewNoteButton extends Component<*> {
  handleClick = () => {
    const note = Plain.deserialize('New Note').toJSON();
    const id = uuid();
    this.props.setNote({ note, id });
    this.props.focusNote(id);
  };
  render() {
    return (
      <ButtonContainer onClick={this.handleClick}>
        <Ink />
        {this.props.children}
      </ButtonContainer>
    );
  }
}

function mapDispatch({ note: { setNote, focusNote } }) {
  return {
    setNote,
    focusNote,
  };
}
export default connect(undefined, mapDispatch)(NewNoteButton);
