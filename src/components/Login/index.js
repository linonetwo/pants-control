// @flow
import { includes } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Flex from 'styled-flex-component';
import { message, Button as ButtonA, Input, AutoComplete } from 'antd';

import { viewerRegister, viewerLogin } from '../../store/actions/core';

const LoginContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`;
const Title = styled.h2``;
const UserNameAutoComplete = styled(AutoComplete)`
  width: 250px;
  margin-bottom: 10px;
`;
const RegisterInput = styled(Input)`
  width: 250px;
  margin-bottom: 10px;
`;
const Buttons = styled(Flex)`
  width: 250px;
`;
const Button = styled(ButtonA)``;

type Props = {
  viewers: string[],
  viewerLogin: ({ name: string, password: string }) => void,
  viewerRegister: ({ name: string, password: string }) => void,
};
type State = {
  name: string,
  password: string,
};
@connect(({ viewer: { viewers } }) => ({ viewers }), { viewerRegister, viewerLogin })
export default class Editors extends Component<Props, State> {
  state = {
    name: '',
    password: '',
  };

  checkInput = () => {
    if (!this.state.name) {
      message.error('请输入您的网名（昵称）');
      return false;
    }
    if (!this.state.password) {
      message.error('请输入用于加密私人内容的密码');
      return false;
    }
    return true;
  };

  hasUser(): boolean {
    return includes(this.props.viewers, this.state.name);
  }
  getTitle(): string {
    if (this.hasUser()) {
      return `用${this.state.name}身份登录`;
    } else if (this.state.name) {
      return `注册新身份${this.state.name}`;
    }
    return '用名称和密码来登录或注册';
  }
  setName = value => this.setState({ name: value });

  render() {
    return (
      <LoginContainer column center>
        <Title>{this.getTitle()}</Title>
        <UserNameAutoComplete
          dataSource={this.props.viewers}
          onSelect={this.setName}
          placeholder="请输入您的网名（昵称）或 profile multihash"
          onChange={this.setName}
          handleSearch={this.setName}
        />
        <RegisterInput
          type="password"
          placeholder="请输入用于加密私人内容的密码"
          value={this.state.password}
          onChange={event => this.setState({ password: event.target.value })}
        />
        <Buttons justifyAround>
          <Button
            onClick={() => {
              if (this.checkInput()) {
                if (this.hasUser()) {
                  this.props.viewerLogin({ name: this.state.name, password: this.state.password });
                } else {
                  this.props.viewerRegister({ name: this.state.name, password: this.state.password });
                }
              }
            }}
          >
            进入
          </Button>
        </Buttons>
      </LoginContainer>
    );
  }
}
