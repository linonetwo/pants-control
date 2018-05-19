// @flow
import { includes } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';
import Flex from 'styled-flex-component';
import { message, Button as ButtonA, Input, AutoComplete, Icon } from 'antd';

import BackgroundAnimation from './BackgroundAnimation';
import type { ViewerDispatch } from '../../store/viewer'

const Container = styled(Flex)`
  height: 100vh;
  width: 100vw;
`;
const loginWidth = 350;
const LoginContainer = styled(Flex)`
  width: ${loginWidth + 150}px;
  padding: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 25px white;

  & i {
    color: #d9d9d9;
  }
`;

const Title = styled.h2``;
const UserNameAutoComplete = styled(AutoComplete)`
  width: ${loginWidth}px !important;
  margin-bottom: 10px !important;
`;
const RegisterInput = styled(Input)`
  width: ${loginWidth}px !important;
  margin-bottom: 10px !important;
`;
const Buttons = styled(Flex)`
  width: ${loginWidth}px;
`;
const Button = styled(ButtonA)`
  width: ${loginWidth}px !important;
  border-color: transparent !important;
  opacity: 0.3 !important;
  ${is('active')`
    opacity: 1 !important;
    background-color: rgba(255,255,255,0.8) !important;
  `};
`;

type Store = {
  availableUsers: string[],
};
type Dispatch = ViewerDispatch;
type State = {
  name: string,
  password: string,
};

class Login extends Component<Store & Dispatch, State> {
  state = {
    name: '',
    password: '',
  };

  componentWillMount() {
    this.props.getAvailableUsers();
  }

  checkInput = () => {
    if (!this.state.name) {
      message.warning('请输入您的网名（昵称）');
      return false;
    }
    if (!this.state.password) {
      message.warning('请输入用于加密私人内容的密码');
      return false;
    }
    return true;
  };

  hasUser(): boolean {
    return includes(this.props.availableUsers, this.state.name);
  }
  get title(): string {
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
      <Container center>
        <BackgroundAnimation />
        <LoginContainer column center>
          <Title>{this.title}</Title>
          <UserNameAutoComplete
            dataSource={this.props.availableUsers}
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
                    this.props.userLogin({ name: this.state.name, password: this.state.password });
                  } else {
                    this.props.createUser({ name: this.state.name, password: this.state.password });
                  }
                }
              }}
            >
              进入
            </Button>
          </Buttons>
        </LoginContainer>
      </Container>
    );
  }
}

const mapState = ({ viewer: { availableUsers } }): Store => ({ availableUsers });
const mapDispatch = ({ viewer: { getAvailableUsers, createUser, userLogin } }: *): Dispatch => ({
  getAvailableUsers,
  createUser,
  userLogin,
});
export default connect(mapState, mapDispatch)(Login);
