/* eslint-disable react/prop-types, react/destructuring-assignment */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import is from 'styled-is';
import Flex from 'styled-flex-component';
import fuzzysearch from 'fuzzysearch';

const SuggestionsList = styled.div`
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;

  background-color: white;
  border-radius: 4px;
  border: 1px solid lightgray;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.05);

  max-height: 300px;
  width: 400px;
  overflow-y: scroll

  transition: opacity 0.75s;
  opacity: ${({ opacity }) => opacity || 0};
  top: ${({ top }) => top || '-10000px'};
  left: ${({ left }) => left || '-10000px'};
`;
const SuggestionItem = styled(Flex)`
  min-height: 30px;
  padding: 5px;
  ${is('selected')`
    background-color: lightgray;
  `};

  cursor: pointer;
`;

class SuggestionsContainer extends Component {
  state = {
    selectedSuggestionIndex: 0,
    filteredSuggestions: [],
  };

  componentDidMount() {
    this.onKeyUp();
  }

  get selectedSuggestion() {
    const { filteredSuggestions, selectedSuggestionIndex } = this.state;
    return selectedSuggestionIndex < filteredSuggestions.length ? filteredSuggestions[selectedSuggestionIndex] : null;
  }

  onKeyUp = keyCode => {
    const { filteredSuggestions } = this.state;

    switch (keyCode) {
      // down
      case 40:
        this.setState(({ selectedSuggestionIndex: prevIndex }) => ({
          selectedSuggestionIndex: prevIndex + 1 === filteredSuggestions.length ? 0 : prevIndex + 1,
        }));
        return true;
      // up
      case 38:
        this.setState(({ selectedSuggestionIndex: prevIndex }) => ({
          selectedSuggestionIndex: prevIndex - 1 === -1 ? filteredSuggestions.length - 1 : prevIndex - 1,
        }));
        return true;
      default: {
        const nextFilteredSuggestions = this.filteredSuggestions;
        if (typeof nextFilteredSuggestions.then === 'function') {
          // deal with async search result
          return nextFilteredSuggestions.then(list => this.setState({ filteredSuggestions: list })).catch(() => {
            this.setState({ filteredSuggestions: [], selectedSuggestionIndex: 0 });
          });
        }
        this.setState({ filteredSuggestions: nextFilteredSuggestions, selectedSuggestionIndex: 0 });
        return true;
      }
    }
  };

  get filteredSuggestions() {
    const { suggestions, value, regex } = this.props;

    if (!value.selection.anchor.key) return [];

    const { anchorText, selection } = value;
    const anchorOffset = selection.anchor.offset;

    const currentWord = this.getCurrentWord(anchorText.text, anchorOffset - 1, anchorOffset - 1);

    const text = this.getMatchText(currentWord, regex);

    if (typeof suggestions === 'function') {
      return suggestions(text);
    }
    return suggestions.filter(suggestion => fuzzysearch(text, suggestion));
  }

  /** is current character the trigger character */
  get lastCharacterIsTrigger() {
    const { value, trigger, onlyTriggerAtStartOfParagraph } = this.props;

    const stateCondition = value.isFocused && !value.selection.isExpanded;
    if (!value.selection.anchor.key) return false;

    const { anchorText } = value;

    if (onlyTriggerAtStartOfParagraph) {
      return stateCondition && anchorText.text === trigger;
    }

    const lastChar = anchorText.text[value.selection.anchor.offset - 1];
    return stateCondition && lastChar && lastChar === trigger;
  }

  getCurrentWord(text, index, initialIndex) {
    if (text[index] === ' ' || text[index] === undefined) return '';
    if (index < initialIndex) {
      return this.getCurrentWord(text, index - 1, initialIndex) + text[index];
    }
    if (index > initialIndex) {
      return text[index] + this.getCurrentWord(text, index + 1, initialIndex);
    }
    return (
      this.getCurrentWord(text, index - 1, initialIndex) +
      text[index] +
      this.getCurrentWord(text, index + 1, initialIndex)
    );
  }

  get matchedInput() {
    const { value, regex } = this.props;

    if (!value.selection.anchor.key) return '';

    const { anchorText } = value;
    const anchorOffset = value.selection.anchor.offset;

    const currentWord = this.getCurrentWord(anchorText.text, anchorOffset - 1, anchorOffset - 1);

    const text = this.getMatchText(currentWord, regex);
    return text;
  }

  /** get text after @ */
  getMatchText = (text, regex) => {
    const matchArr = text.match(regex);
    if (matchArr) {
      return matchArr[1].toLowerCase();
    }
    return '';
  };

  getMenuStyle = () => {
    const { containerRef } = this;
    const selection = window.getSelection();

    if (containerRef && (this.matchedInput || this.lastCharacterIsTrigger) && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      return {
        opacity: 1,
        top: `calc(${rect.top}px + ${window.scrollY}px + 22px)`,
        left: `calc(${rect.left}px + ${window.scrollX}px)`,
      };
    }

    return {};
  };

  onClick = (event, suggestion) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('aaa')
    const { onEnterSuggestion, value, onChange } = this.props;
    console.log(suggestion)
    onEnterSuggestion(suggestion, value.change, onChange);
  };

  render() {
    const { filteredSuggestions, selectedSuggestionIndex } = this.state;

    const mountPoint = document.getElementById('root');
    if (mountPoint) {
      const { opacity, top, left } = this.getMenuStyle();
      return ReactDOM.createPortal(
        <SuggestionsList
          data-usage="slate-suggestions-plugin"
          opacity={opacity}
          top={top}
          left={left}
          innerRef={containerRef => {
            this.containerRef = containerRef;
          }}
        >
          {filteredSuggestions.length === 0 && <SuggestionItem center>没有结果了</SuggestionItem>}
          {filteredSuggestions.map((suggestion, index) => (
            <SuggestionItem
              alignCenter
              selected={index === selectedSuggestionIndex}
              onClick={event => this.onClick(event, suggestion.suggestion)}
              onMouseEnter={() => this.setState({ selectedSuggestionIndex: index })}
              key={suggestion.suggestion}
            >
              {suggestion.suggestion}
            </SuggestionItem>
          ))}
        </SuggestionsList>,
        mountPoint,
      );
    }
    return null;
  }
}

export default SuggestionsContainer;
