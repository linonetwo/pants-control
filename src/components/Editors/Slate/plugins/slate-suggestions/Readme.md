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
    key: 'Jon Snow',
    value: '@Jon Snow',
    display: 'Jon Snow', // Can be either string or react component
  },
  {
    key: 'John Evans',
    value: '@John Evans',
    display: 'John Evans',
  },
  {
    key: 'Daenerys Targaryen',
    value: '@Daenerys Targaryen',
    display: 'Daenerys Targaryen',
  },
  {
    key: 'Cersei Lannister',
    value: '@Cersei Lannister',
    display: 'Cersei Lannister',
  },
  {
    key: 'Tyrion Lannister',
    value: '@Tyrion Lannister',
    display: 'Tyrion Lannister',
  },
];
function getCurrentWord(text, index, initialIndex) {
  if (index === initialIndex) {
    return { start: getCurrentWord(text, index - 1, initialIndex), end: getCurrentWord(text, index + 1, initialIndex) };
  }
  if (text[index] === ' ' || text[index] === '@' || text[index] === undefined) {
    return index;
  }
  if (index < initialIndex) {
    return getCurrentWord(text, index - 1, initialIndex);
  }
  if (index > initialIndex) {
    return getCurrentWord(text, index + 1, initialIndex);
  }
}

class SlateEditor extends Component<Store & Dispatch & Props, State> {
  constructor(props) {
    super(props);

    // setup slate plugins
    const suggestionsPlugin = SuggestionsPlugin({
      trigger: '@',
      regex: /@([\w]*)/,
      suggestions,
      onEnterSuggestion: (suggestion, change, onChange) => {
        if (!change?.value) return null;
        const { anchorText, selection } = change.value;
        const anchorOffset = selection.anchor.offset;
        const { text } = anchorText;

        let index = { start: anchorOffset - 1, end: anchorOffset };

        if (text[anchorOffset - 1] !== '@') {
          index = getCurrentWord(text, anchorOffset - 1, anchorOffset - 1);
        }

        const newText = `${text.substring(0, index.start)}${suggestion.value} `;

        onChange(change.deleteBackward(anchorOffset).insertText(newText));

        return true;
      },
    });
    const { Suggestions } = suggestionsPlugin;
    this.Suggestions = Suggestions;
    this.plugins = [suggestionsPlugin];
  }

  state = {
    value: Plain.deserialize(''),
  };

  render() {
    const { value } = this.state;
    const { plugins, Suggestions } = this;
    return (
      <Fragment>
        <Suggestions value={value} onChange={this.onChange} />
        ...
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
