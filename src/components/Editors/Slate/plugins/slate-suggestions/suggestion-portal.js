/* eslint-disable react/prop-types, react/destructuring-assignment */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import position from './caret-position';
import SuggestionItem from './suggestion-item';
import getCurrentWord from './current-word';
import { UP_ARROW_KEY, DOWN_ARROW_KEY, RESULT_SIZE } from './constants';

class SuggestionPortal extends Component {
  constructor(props) {
    super(props);
    props.callback.onKeyDown = this.onKeyDown;
    props.callback.onEnter = props.onEnter;
    props.callback.closePortal = this.closePortal;
    props.callback.readOnly = false;

    this.isOpen = false;
    this.selectedIndex = 0;
    if (typeof props.suggestions === 'function') {
      props.callback.suggestion = undefined;
    } else {
      this.state.filteredSuggestions = props.suggestions.slice(0, props.resultSize ? props.resultSize : RESULT_SIZE);
      props.callback.suggestion = this.state.filteredSuggestions[this.selectedIndex];
    }
  }

  state = {
    filteredSuggestions: [],
  };

  componentDidMount = () => {
    this.isOpen = true;
    this.adjustPosition();
  };

  componentDidUpdate = () => {
    this.isOpen = true;
    this.adjustPosition();
  };

  setCallbackSuggestion = () => {
    if (this.state.filteredSuggestions.length) {
      this.props.callback.suggestion = this.state.filteredSuggestions[this.selectedIndex];
    } else {
      this.props.callback.suggestion = undefined;
    }
  };

  setFilteredSuggestions = filteredSuggestions => {
    this.setState({
      filteredSuggestions,
    });
    this.setCallbackSuggestion();
  };

  onKeyDown = keyCode => {
    const { filteredSuggestions } = this.state;

    if (keyCode === DOWN_ARROW_KEY) {
      if (this.selectedIndex + 1 === filteredSuggestions.length) {
        this.selectedIndex = -1;
      }
      this.selectedIndex += 1;
      this.setCallbackSuggestion();
      this.forceUpdate();
    } else if (keyCode === UP_ARROW_KEY) {
      if (this.selectedIndex === 0) {
        this.selectedIndex = filteredSuggestions.length;
      }
      this.selectedIndex -= 1;
      this.setCallbackSuggestion();
      this.forceUpdate();
    } else {
      this.selectedIndex = 0;
      const newFilteredSuggestions = this.getFilteredSuggestions();
      if (typeof newFilteredSuggestions.then === 'function') {
        newFilteredSuggestions.then(this.setFilteredSuggestions).catch(() => {
          this.setFilteredSuggestions([]);
        });
      } else {
        this.setFilteredSuggestions(newFilteredSuggestions);
      }
    }
  };

  matchTrigger = () => {
    const { value, trigger, startOfParagraph } = this.props;

    const stateCondition = value.isFocused && !value.selection.isExpanded;

    if (!value.selection.anchor.key) return false;

    const { anchorText } = value;

    if (startOfParagraph) {
      return stateCondition && anchorText.text === trigger;
    }

    const lastChar = anchorText.text[value.selection.anchor.offset - 1];

    return stateCondition && lastChar && lastChar === trigger;
  };

  matchInput = () => {
    const { value, regex } = this.props;

    if (!value.selection.anchor.key) return '';

    const { anchorText } = value;
    const anchorOffset = value.selection.anchor.offset;

    const currentWord = getCurrentWord(anchorText.text, anchorOffset - 1, anchorOffset - 1);

    const text = this.getMatchText(currentWord, regex);
    return text;
  };

  getMatchText = (text, regex) => {
    const matchArr = text.match(regex);

    if (matchArr) {
      return matchArr[1].toLowerCase();
    }

    return undefined;
  };

  getFilteredSuggestions = () => {
    const { suggestions, value, regex, resultSize } = this.props;

    if (!value.selection.anchor.key) return [];

    const { anchorText } = value;
    const anchorOffset = value.selection.anchor.offset;

    const currentWord = getCurrentWord(anchorText.text, anchorOffset - 1, anchorOffset - 1);

    const text = this.getMatchText(currentWord, regex);

    if (typeof suggestions === 'function') {
      return suggestions(text);
    }
    return suggestions
      .filter(suggestion => suggestion.key.toLowerCase().indexOf(text) !== -1)
      .slice(0, resultSize || RESULT_SIZE);
  };

  adjustPosition = () => {
    const { menu } = this;
    if (!menu) return;

    const match = this.matchInput();
    if (match === undefined) {
      menu.removeAttribute('style');
      return;
    }

    if (this.matchTrigger() || match) {
      const rect = position();
      menu.style.display = 'block';
      menu.style.position = 'absolute';
      menu.style.opacity = 1;
      menu.style.top = `calc(${rect.top}px + ${window.scrollY}px)`; // eslint-disable-line no-mixed-operators
      menu.style.left = `calc(${rect.left}px + ${window.scrollX}px)`; // eslint-disable-line no-mixed-operators
    }
  };

  closePortal = () => {
    const { menu } = this;
    if (!menu) return;

    if (!this.matchTrigger()) {
      menu.removeAttribute('style');
    }
  };

  setSelectedIndex = selectedIndex => {
    this.selectedIndex = selectedIndex;
    this.forceUpdate();
  };

  setMenuRef = menu => {
    this.menu = menu;
  };

  render() {
    const { filteredSuggestions } = this.state;
    const { value, onChange } = this.props;
    if (!this.isOpen) {
      return null;
    }

    const mountPoint = document.getElementById('root');
    if (mountPoint) {
      return ReactDOM.createPortal(
        <div className="suggestion-portal" ref={this.setMenuRef}>
          <ul>
            {filteredSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.key}
                index={index}
                suggestion={suggestion}
                selectedIndex={this.selectedIndex}
                setSelectedIndex={this.setSelectedIndex}
                appendSuggestion={this.props.callback.onEnter}
                closePortal={this.closePortal}
                editor={this.props.callback.editor}
                value={value}
                onChange={onChange}
              />
            ))}
          </ul>
        </div>,
        mountPoint,
      );
    }
    return null;
  }
}

export default SuggestionPortal;
