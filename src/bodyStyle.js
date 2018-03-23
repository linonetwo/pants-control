import { injectGlobal } from 'styled-components';
import styledNormalize from 'styled-normalize';
import 'antd/dist/antd.css';

injectGlobal`
  ${styledNormalize};

  * {
    box-sizing: border-box;
    outline: none;
    font-family: Arial, Helvetica, Helvetica Neue, "Microsoft Yahei", STXihei, "华文细黑", "PingFang SC", serif;
    color: #333;
  }
  body {
    position: relative;
    -webkit-font-smoothing: antialiased;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-color: white;
    overflow: auto;
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

  #root {
    height: 100%;
    & > div {
      height: 100%;
    }
  }

  p {
    margin: 0;
  }
  
  li {
    list-style: none;
  }
  
  a {
    text-decoration: none;
  }
  
  a:hover {
    opacity: 1;
    text-decoration: none;
    cursor: pointer;
  }

  ::selection {
    background:rgba(255, 255, 125, 0.99);
    color:#032764;
  }
`;
