import SuggestionsPlugin from '../slate-suggestions';

/** 获取 @ 之前的文本结束的index，用于获取 @ 前的整段文本 */
function getCurrentTextEnd(text, index, initialIndex) {
  if (index === initialIndex) {
    return getCurrentTextEnd(text, index - 1, initialIndex);
  }
  if (text[index] === ' ' || text[index] === '@' || text[index] === undefined) {
    return index;
  }
  if (index < initialIndex) {
    return getCurrentTextEnd(text, index - 1, initialIndex);
  }
  if (index > initialIndex) {
    return getCurrentTextEnd(text, index + 1, initialIndex);
  }
}

export default function SuggestNodeChangePlugin(options = {}) {
  const suggestions = options.suggestions || [
    {
      key: 'title标题biaoti',
      value: 'title',
      display: 'Title',
    },
    {
      key: 'paragraph段落duanluo',
      value: 'paragraph',
      display: 'Paragraph',
    },
  ];
  // setup slate-suggestions plugin
  const suggestionsPlugin = SuggestionsPlugin({
    trigger: '@',
    regex: /@([\w]*)/,
    suggestions,
    onEnterSuggestion: (suggestion, change, onChange) => {
      if (!change?.value) return null;
      const { anchorText, selection } = change.value;
      const anchorOffset = selection.anchor.offset;
      const { text } = anchorText;

      let prefixEndIndex = anchorOffset - 1;
      if (text[anchorOffset - 1] !== '@') {
        prefixEndIndex = getCurrentTextEnd(text, anchorOffset - 1, anchorOffset - 1);
      }

      onChange(change.deleteBackward(anchorOffset).insertText(text.substring(0, prefixEndIndex)).setBlocks(suggestion.value));
      return true;
    },
    ...options,
  });

  return suggestionsPlugin;
}
