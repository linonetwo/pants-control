// @flow
import React, { Component } from 'react';
import { MegadraftEditor, editorStateFromRaw } from 'megadraft';
import { Tooltip } from 'rebass';
import { convertToRaw } from 'draft-js';
import { List } from 'immutable';
import styled from 'styled-components';

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

type ActorProps = {
  tags: List<List<string>>,
  id: string,
  initialContent: string,
  textInputAction: Function,
  executeCodeAction: Function,
  saveCardToMemoryAction: Function,
  setAsConfigAction: Function,
};
type ActorState = {
  editorState: Object,
};
export default class Actor extends Component {
  props: ActorProps;
  state: ActorState;

  constructor(props: ActorProps) {
    super(props);
    this.state = { editorState: editorStateFromRaw(props.initialContent && JSON.parse(props.initialContent)) };
  }

  onEditorChange = (editorState: Object) => {
    this.setState({ editorState });
  };

  annotateContent = () => {
    const text = this.getContent(' ');
    this.props.textInputAction({ text, id: this.props.id });
  };

  saveContent = () => {
    const content = convertToRaw(this.state.editorState.getCurrentContent());
    this.props.saveCardToMemoryAction({ content, id: this.props.id });
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
    {
      name: 'execute',
      isKeyBound: (e: SyntheticKeyboardEvent) => e.key === 'e' && (e.metaKey || e.ctrlKey),
      action: () => {
        this.runCode();
      },
    },
  ];

  onSave() {
    this.annotateContent();
    this.saveContent();
  }

  runCode() {
    this.props.executeCodeAction({ code: this.getContent('\n'), id: this.props.id, language: 'js/babel' });
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
            <SignalCreatorStandard
              onClick={() => this.props.setAsConfigAction({ content: this.getContent('\n'), id: this.props.id })}
            >
              用于更新设置
            </SignalCreatorStandard>
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
