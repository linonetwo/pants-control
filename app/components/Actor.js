// @flow
import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import { Tooltip } from 'rebass';
import { convertToRaw } from 'draft-js';
import { List } from 'immutable';
import styled from 'styled-components';
import vm from 'vm';

const ActorContainer = styled.div`
  max-width: 100%;
  max-height: 1000px;
  min-height: 70px;
  padding: 10px;

  background-color: white;
  box-shadow: inset 0 0 0 1px #dee1e3, 0 0 4px #dee1e3;
  border-radius: 4px;

  color: #333333;
`;
const ActorContent = styled.article`
  padding: 10px 0;

  display: flex;
  flex-direction: column;
  min-height: 50px;
  width: 100%;
`;
const MetaInfoContainer = styled.nav`
  max-height: 30px;
  width: 100%;
`;
const SignalCreatorStandard = styled.button`
  border-radius: 99999px;
  padding: 8px 16px;

  color: #333333;
  background-color: white;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  text-decoration: none;

  box-shadow: inset 0 0 0 2px;
  border: 0;
`;

export default class Actor extends Component {
  props: {
    tags: List<List<string>>,
    id: string,
    textInputAction: Function,
  };
  state = { editorState: editorStateFromRaw(null) };

  onEditorChange = (editorState: Object) => {
    this.setState({ editorState });
  };

  annotateContent = () => {
    const text = this.getContent(' ');
    this.props.textInputAction({ text, id: this.props.id });
  };

  getContent(joinBy: string): string {
    if (this.state.editorState) {
      const contentJSON = convertToRaw(this.state.editorState.getCurrentContent());
      if (contentJSON.blocks) {
        const text: string = contentJSON.blocks.map(block => block.text).join(joinBy);
        return text;
      }
    }
    return '';
  }

  keyBindings = [
    {
      name: 'save',
      isKeyBound: (e: SyntheticKeyboardEvent) => e.key === 's' && (e.metaKey || e.ctrlKey),
      action: () => {
        this.onSave();
      },
    },
  ];

  onSave() {
    this.annotateContent();
  }

  runCode() {
    // eslint-disable-next-line object-shorthand
    vm.runInNewContext(this.getContent('\n'), { require: require });
  }

  render() {
    return (
      <ActorContainer>
        <ActorContent>
          <MegadraftEditor
            editorState={this.state.editorState}
            onChange={this.onEditorChange}
            keyBindings={this.keyBindings}
          />
        </ActorContent>
        <MetaInfoContainer>
          <Tooltip text="插件">
            <SignalCreatorStandard>库存管理</SignalCreatorStandard>
          </Tooltip>
          {this.props.tags.toJS().map(([type, value]) => (
            <Tooltip key={type} text={type}>
              <SignalCreatorStandard>{value}</SignalCreatorStandard>
            </Tooltip>
          ))}
        </MetaInfoContainer>
      </ActorContainer>
    );
  }
}
