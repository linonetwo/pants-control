/* eslint no-unused-expressions: "off" */
import { injectGlobal } from 'styled-components';
import styledNormalize from 'styled-normalize';

injectGlobal`
  ${styledNormalize};

  body {
    margin: 0;
  }
  * {
    outline: none;
    color: #333;
    font-family: Arial, Helvetica, Helvetica Neue, "Microsoft Yahei", "PingFang SC", "华文细黑", STXihei, serif;
    -webkit-font-smoothing: antialiased;
  }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
  }

  select::-ms-expand {
    display: none;
  }
  [placeholder]{
    text-overflow:ellipsis;
  }
  ::placeholder{
    text-overflow:ellipsis;
  }
  input[type=search] {
    appearance: none;
  }

  a {
    color: #333;
    text-decoration: none;
  }
  
  a:hover {
    opacity: 1;
    text-decoration: none;
    cursor: pointer;
  }

  ::-webkit-scrollbar{
    display:none;
  }
`;
