// @flow
export function open(url: string) {
  const a = document.createElement('a');
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.href = url;
  a.click();
}
