// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { btn } from 'styled-components-mixins/materialize';
import Flex from 'styled-flex-component';
import Ink from 'react-ink';
import Plain from 'slate-plain-serializer';
import uuid from 'uuid/v4';

const ButtonContainer = styled(Flex)`
  ${btn};
  background-color: white;
  color: #333;
  box-shadow: none;
  &:hover,
  &:focus {
    background-color: white;
    color: #333;
  }
  &:focus {
    box-shadow: none;
  }

  width: 100%;
  max-width: 300px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  text-align: left;
  padding-left: 5px;
  padding-right: 5px;
`;

class NewNoteButton extends Component<*> {
  handleClick = () => {
    const note = JSON.stringify(Plain.deserialize('').toJSON());
    const id = uuid();
    this.props.setNote({ note, id });
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

function mapDispatch({ note: { setNote } }) {
  return {
    setNote,
  };
}
export default connect(undefined, mapDispatch)(NewNoteButton);
