// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { MegadraftEditor, editorStateFromRaw, editorStateToJSON } from 'megadraft';

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
`;

const ActorFlow = styled.div`
  max-width: 1000px;
  min-width: 45vw;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

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

export default class HomePage extends Component {
  state = { editorState: editorStateFromRaw(null) };

  onEditorChange = editorState => {
    this.setState({ editorState });
    const serializedContent: ?string = editorStateToJSON(editorState);
    if (serializedContent) {
      const contentJSON = JSON.parse(serializedContent);
      if (contentJSON.blocks) {
        const content = contentJSON.blocks.map(block => block.text);
        console.log(content)
      }
    }
  };

  render() {
    return (
      <Container>
        <ActorFlow>
          <ActorContainer>
            <MetaInfoContainer>
              <SignalCreatorStandard>库存管理</SignalCreatorStandard>
            </MetaInfoContainer>
            <ActorContent>asdfasdfasdf</ActorContent>
          </ActorContainer>
        </ActorFlow>
        <ActorFlow>
          <ActorContainer>
            <ActorContent>
              <MegadraftEditor editorState={this.state.editorState} onChange={this.onEditorChange} />
            </ActorContent>
            <MetaInfoContainer>
              <SignalCreatorStandard>库存管理</SignalCreatorStandard>
            </MetaInfoContainer>
          </ActorContainer>
        </ActorFlow>
      </Container>
    );
  }
}
