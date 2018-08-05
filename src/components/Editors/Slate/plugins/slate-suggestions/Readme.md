# Slate-Suggestions

<h3 align="center"><code>slate-suggestions</code></h3>

A [**Slate**](https://github.com/ianstormtaylor/slate) plugin to suggestion replacements or actions based on input. Useful for implementing "mention" or other suggestion based behaviors.

Modify from [oozou's original plugin](https://github.com/oozou/slate-suggestions).

## Usage

```js
import SuggestionsPlugin from 'slate-suggestions'
import { Editor } from 'slate'

const suggestions = [
  {
    key: 'jon-snow',
    value: '@Jon Snow',
    suggestion: '@Jon Snow' // Can be string or react component
  },
  // Some other suggestions
]

const suggestionsPlugin = SuggestionsPlugin({
  trigger: '@',
  capture: /@([\w]*)/,
  suggestions,
  onEnter: (suggestion) => {
    // Modify your state up to your use-cases
    return modifiedState
  }
})

// Extract portal component from the plugin
const { SuggestionPortal } = suggestionPlugin

// Add the plugin to your set of plugins...
const plugins = [
  suggestionPlugin
]

// And later pass it into the Slate editor...
<Editor
  ...
  plugins={plugins}
/>
// And add portal component together with the editor
<SuggestionPortal
  value={this.state.value}
/>
```

Option | Type | Description
--- | --- | ---
**`trigger`** | `String` | The trigger to match the inputed character, use to open the portal.
**`regex`** | `RegExp` | A regexp that must match the text after the trigger to keep the portal open and extract the text to filter suggestions.
**`suggestions`** | `Array` | An array of suggestions object which have the following keys `key`, `value` and `suggestion`. `suggestion` can be string or react component.
**`onEnterSuggestion`** | `Function` | A function use to handle return/enter keypress to append suggestion into editor.
**`onlyTriggerAtStartOfParagraph`** | `Boolean` | An optional flag that use to check that portal will trigger only when trigger string is at the start of paragraph.
**`resultSize`** | `Number` | An optional number use to set size of suggestion result. Default is 5. (Deleted)

---
