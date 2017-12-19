// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { Map, List } from 'immutable';

import { textInputAction } from '../reducers/nlp';
import { addNewCardAction, saveCardToMemoryAction } from '../reducers/cards';
import { executeCodeAction } from '../reducers/execute';
import { setAsConfigAction } from '../reducers/config';
import type { Notes } from '../reducers/cards';

import Actor from '../components/Actor';

const Container = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: row;
`;

const ActorFlow = styled.div`
  max-width: 1000px;
  min-width: 45vw;
  height: 100%;
  overflow-y: scroll;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

function mapStateToProps(state) {
  return {
    notes: state.cards.getIn(['entities', 'notes']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      textInputAction,
      addNewCardAction,
      saveCardToMemoryAction,
      executeCodeAction,
      setAsConfigAction,
    },
    dispatch,
  );
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends Component {
  props: {
    textInputAction: Function,
    addNewCardAction: Function,
    saveCardToMemoryAction: Function,
    executeCodeAction: Function,
    setAsConfigAction: Function,
    notes: Map<Notes>,
  };

  render() {
    return (
      <Container>
        <ActorFlow>
          <button onClick={() => this.props.addNewCardAction()}>+</button>
          {this.props.notes
            .get('allIDs')
            .toArray()
            .map(aNoteID => {
              const aNote = this.props.notes.getIn(['byID', aNoteID]);
              return (
                <Actor
                  key={aNote.get('id')}
                  id={aNote.get('id')}
                  textInputAction={this.props.textInputAction}
                  saveCardToMemoryAction={this.props.saveCardToMemoryAction}
                  setAsConfigAction={this.props.setAsConfigAction}
                  tags={aNote.get('tags')}
                  initialContent={aNote.get('content')}
                  executeCodeAction={this.props.executeCodeAction}
                />
              );
            })}
        </ActorFlow>
      </Container>
    );
  }
}
