import React, { Component } from 'react';

class SuggestionItem extends Component {
  onClick = e => {
    this.props.closePortal();

    const { editor, suggestion, appendSuggestion, value, onChange } = this.props;

    const change = value.change();
    appendSuggestion(suggestion, change);
    onChange(change);
  };

  onMouseEnter = () => this.props.setSelectedIndex(this.props.index);

  render() {
    return (
      <li
        className={this.props.index === this.props.selectedIndex ? 'selected' : undefined}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
      >
        {this.props.suggestion.suggestion}
      </li>
    );
  }
}

export default SuggestionItem;
