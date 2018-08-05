import React, { createRef } from 'react';
import SuggestionsContainer from './SuggestionsContainer';

function SuggestionsPlugin(options) {

  const SuggestionsRef = createRef();

  function Suggestions(props) {
    return <SuggestionsContainer ref={SuggestionsRef} {...props} {...options} />;
  }
  return {
    onKeyUp(event, change, editor) {
      const { keyCode } = event;

      // is user is focusing in this node and it contains pattern to open the suggestions
      if (change.value.isFocused && options.regex.test(change.value.blocks.first().text)) {
        // on onEnter pressed
        if (keyCode === 13) {
          // When a suggestion is selected
          // Prevent default return/enter key press when portal is open
          event.preventDefault();

          // Close portal after a suggestion is selected
          if (options.onPortalClose) {
            options.onPortalClose(change.value, editor.onChange);
          }

          // Handle entering a suggestion
          if (options.onEnterSuggestion && options.suggestion !== undefined) {
            return options.onEnterSuggestion(options.suggestion, change, editor.onChange);
          }
        } else if (SuggestionsRef?.current?.onKeyUp) {
          // passing keyCode to SuggestionContainer's handler
          if (keyCode === 38 || keyCode === 40) {
            // Prevent default up and down arrow key press when portal is open
            event.preventDefault();
          }
          // if user is input other characters
          return SuggestionsRef.current.onKeyUp(keyCode);
        }
      }
    },
    Suggestions,
  };
}

export default SuggestionsPlugin;
