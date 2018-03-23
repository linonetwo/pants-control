// @flow
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
  render() {
    return (
      <LoginContainer column center>
        <Title>输入你的昵称</Title>
        <UserNameAutoComplete
          dataSource={this.props.viewers}
          onSelect={value => this.setState({ name: value })}
          placeholder="请输入您的网名（昵称）或 profile multihash"
          value={this.state.name}
          handleSearch={value => this.setState({ name: value })}
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
              this.checkInput();
            }}
          >
            进入
          </Button>
        </Buttons>
      </LoginContainer>
    );
  }
}
