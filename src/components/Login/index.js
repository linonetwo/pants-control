// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Flex from 'styled-flex-component';

const LoginContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`;
const Title = styled.h2``;
const WebIDInput = styled.input`
  border: 1px solid whitesmoke;
  padding: 5px 10px;
  width: 250px;
`;
const Buttons = styled(Flex)``;
const Button = styled.button``;
export default class Editors extends Component {
  render() {
    return (
      <LoginContainer column center>
        <Title>输入你的 WebID</Title>
        <WebIDInput />
        <Buttons>
          <Button>注册</Button>
          <Button>登录</Button>
        </Buttons>
      </LoginContainer>
    );
  }
}
