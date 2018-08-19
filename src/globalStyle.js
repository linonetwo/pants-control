/* eslint no-unused-expressions: "off" */
import { injectGlobal } from 'styled-components';
import styledNormalize from 'styled-normalize';
import 'prismjs/themes/prism-tomorrow.css';

injectGlobal`
  ${styledNormalize};

  body {
    margin: 0;
    color: #333;
    font-family: Arial, Helvetica, Helvetica Neue, "Microsoft Yahei", "PingFang SC", "华文细黑", STXihei, serif;
  }
  * {
    -webkit-font-smoothing: antialiased;
    outline: none;
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

  .ant-popover-arrow {
    display: none !important;
  }
  .ant-menu-vertical {
    border-right: none !important;
  }
  .ant-menu-item  > span > span.material-icons, .ant-menu-submenu-title  > span > span.material-icons {
    vertical-align: middle;
    margin-left: -15px;
  }
`;
