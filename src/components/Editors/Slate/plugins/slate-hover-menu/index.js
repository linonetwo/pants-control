import React from 'react';
import Component from './HoverMenu';

export default function HoverMenuPlugin(options = {}) {
  const buttons = options.buttons || [
    { type: 'bold', icon: 'format_bold' },
    { type: 'italic', icon: 'format_italic' },
    { type: 'underlined', icon: 'format_underlined' },
    { type: 'code', icon: 'code' },
  ];
  function HoverMenu(props) {
    return <Component buttons={buttons} {...props} {...options} />;
  }

  return {
    HoverMenu,
  };
}
