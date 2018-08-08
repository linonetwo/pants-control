import React from 'react';
import HoverMenu from './HoverMenu';

export default function HoverMenuPlugin(options = {}) {
  const buttons = options.buttons || [
    { type: 'bold', icon: 'format_bold' },
    { type: 'italic', icon: 'format_italic' },
    { type: 'underlined', icon: 'format_underlined' },
    { type: 'code', icon: 'code' },
  ];
  const onButtonClicked =
    options.onButtonClicked || ((value, onChange, button) => onChange(value.change().toggleMark(button.type)));

  return {
    renderPortal(value, editor) {
      return <HoverMenu buttons={buttons} onButtonClicked={onButtonClicked} value={value} onChange={editor.onChange} />;
    },
  };
}
