import React from 'react';
import HoverMenu from './HoverMenu';

export default function HoverMenuPlugin(options = {}) {
  const buttons = options.buttons || [
    { type: 'bold', icon: 'format_bold' },
    { type: 'italic', icon: 'format_italic' },
    { type: 'underlined', icon: 'format_underlined' },
    { type: 'code', icon: 'code' },
  ];

  return {
    renderPortal(value, editor) {
      return <HoverMenu buttons={buttons} value={value} onChange={editor.onChange} {...options} />;
    },
  };
}
