import React, { createRef } from 'react';
import SuggestionsContainer from './SuggestionsContainer';

function SuggestionsPlugin(options) {
  const SuggestionsContainerRef = createRef();

  return {
    onKeyDown(event, change, editor) {
      const { keyCode } = event;
      // is user is focusing in this node and it contains pattern to open the suggestions
      if (change.value.isFocused && options.regex.test(change.value.blocks.first().text)) {
        // on onEnter pressed
        if (
          keyCode === 13 &&
          (SuggestionsContainerRef?.current?.matchedInput ||
            SuggestionsContainerRef?.current?.lastCharacterIsTrigger) &&
          window.getSelection().rangeCount > 0
        ) {
          // When a suggestion is selected
          // Prevent default return/enter key press when portal is open
          event.preventDefault();
          event.stopPropagation();

          // Close portal after a suggestion is selected
          if (options.onPortalClose) {
            options.onPortalClose(change.value, editor.onChange);
          }

          // Handle entering a suggestion
          if (options.onEnterSuggestion && SuggestionsContainerRef?.current?.selectedSuggestion) {
            return options.onEnterSuggestion(
              SuggestionsContainerRef?.current?.selectedSuggestion,
              change,
              editor.onChange,
            );
          }
        } else if (SuggestionsContainerRef?.current?.onKeyUp && (keyCode === 38 || keyCode === 40)) {
          // passing keyCode to SuggestionContainer's handler
          // Prevent default up and down arrow key press when portal is open
          event.preventDefault();
          event.stopPropagation();
          return SuggestionsContainerRef.current.onKeyDown(keyCode);
        }
      }
    },
    onKeyUp(event, change) {
      const { keyCode } = event;

      // is user is focusing in this node and it contains pattern to open the suggestions
      if (change.value.isFocused && options.regex.test(change.value.blocks.first().text)) {
        if (SuggestionsContainerRef?.current?.onKeyUp) {
          // passing keyCode to SuggestionContainer's handler
          // if user is input other characters
          return SuggestionsContainerRef.current.onKeyUp(keyCode);
        }
      }
    },
    onBlur() {
      if (SuggestionsContainerRef.current.state.mouseInNotHandled) {
        return true;
      }
      return null;
    },
    renderPortal(value, editor) {
      return (
        <SuggestionsContainer ref={SuggestionsContainerRef} value={value} onChange={editor.onChange} {...options} />
      );
    },
  };
}

export default SuggestionsPlugin;
