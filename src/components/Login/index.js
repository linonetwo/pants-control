// @flow
import { includes } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';
import Flex from 'styled-flex-component';
import { message, Button as ButtonA, Input, AutoComplete, Icon } from 'antd';

import { viewerRegister, viewerLogin } from '../../store/actions/core';
import BackgroundAnimation from './BackgroundAnimation';

const LoginContainer = styled(Flex)`
  width: 100%;
  height: 100%;
`;

const loginWidth = 350;
const Title = styled.h2``;
const UserNameAutoComplete = styled(AutoComplete)`
  width: ${loginWidth}px;
  margin-bottom: 10px;
`;
const RegisterInput = styled(Input)`
  width: ${loginWidth}px;
  margin-bottom: 10px;
`;
const Buttons = styled(Flex)`
  width: ${loginWidth}px;
`;
const Button = styled(ButtonA)`
  width: ${loginWidth}px;
  border-color: transparent;
  opacity: 0.3;
  ${is('active')`
    opacity: 1;
  `};
`;

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
        <BackgroundAnimation />
        <Title>{this.getTitle()}</Title>
        <UserNameAutoComplete
          dataSource={this.props.viewers}
          onSelect={this.setName}
          onChange={this.setName}
          handleSearch={this.setName}
        >
          <Input placeholder="请输入您的网名（昵称）或 profile multihash" prefix={<Icon type="user" />} />
        </UserNameAutoComplete>
        <RegisterInput
          type="password"
          prefix={<Icon type="lock" />}
          placeholder="请输入用于加密私人内容的密码"
          value={this.state.password}
          onChange={event => this.setState({ password: event.target.value })}
        />
        <Buttons justifyAround>
          <Button
            active={this.state.name && this.state.password}
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
