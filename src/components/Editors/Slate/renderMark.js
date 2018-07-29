import React from 'react';

export default function renderMark(props) {
  const { children, mark } = props;
  switch (mark.type) {
    case 'bold':
      return <strong>{children}</strong>;
    case 'code':
      return <code>{children}</code>;
    case 'italic':
      return <em>{children}</em>;
    case 'underlined':
      return <u>{children}</u>;
    default:
      return <span>{children}</span>;
  }
}
