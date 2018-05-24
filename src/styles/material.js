import { css } from 'styled-components';
import { btn } from 'styled-components-mixins/materialize';

export const materialButton = css`
  ${btn};
  background-color: white;
  color: #333;
  box-shadow: none;
  &:hover,
  &:focus {
    background-color: white;
    color: #333;
  }
  &:focus {
    box-shadow: none;
  }

  width: min-content;
  max-width: 300px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  text-align: left;
  padding-left: 5px;
  padding-right: 5px;

  position: relative;
`;
