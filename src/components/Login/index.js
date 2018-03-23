// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import { Toolbar, Close } from 'rebass';

import { viewerRegister, viewerLogin } from '../../store/actions/core';

const LoginContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`;
const Title = styled.h2``;
const RegisterInput = styled.input`
  border: 1px solid whitesmoke;
  padding: 5px 10px;
  width: 250px;
`;
const Buttons = styled(Flex)``;
const Button = styled.button``;

@connect(() => {}, { viewerRegister, viewerLogin })
export default class Editors extends Component {
  state = {
    name: '',
    password: '',
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  checkInput = () => {
    if (!this.state.name) {
      throw new Error('请输入您的网名（昵称）');
    }
    if (!this.state.password) {
      throw new Error('请输入用于加密私人内容的密码');
    }
  };
  render() {
    return (
      <LoginContainer column center>
        <Title>输入你的昵称</Title>
        {this.state.errorInfo && (
          <Toolbar>
            {this.state.errorInfo}
            <Close ml="auto" />
          </Toolbar>
        )}
        <RegisterInput
          type="text"
          value={this.state.name}
          onChange={event => this.setState({ name: event.target.value })}
        />
        <RegisterInput
          type="password"
          value={this.state.password}
          onChange={event => this.setState({ password: event.target.value })}
        />
        <Buttons>
          <Button
            onClick={() => {
              this.checkInput();
            }}
          >
            注册
          </Button>
          <Button>登录</Button>
        </Buttons>
      </LoginContainer>
    );
  }
}
