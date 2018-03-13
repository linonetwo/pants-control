import { injectGlobal } from 'styled-components';

injectGlobal`
  * {
    box-sizing: border-box;
    transition: all .35s;
    outline: none;
  }
  body {
    -webkit-font-smoothing: antialiased;
    color: #333333;
    height: 100vh;
    background-color: white;
    font-family: Arial, Helvetica, Helvetica Neue, serif;
    overflow: hidden;
    margin: 0;
  }

  #root {
    height: 100%;
  }

  p {
    font-size: 24px;
  }

  li {
    list-style: none;
  }

  a {
    color: #666666;
    text-decoration: none;
  }

  a:hover {
    opacity: 1;
    text-decoration: none;
    cursor: pointer;
  }

  ::selection {
    background:rgba(255, 255, 125, 0.99)
    color:#032764;
  }
`;
