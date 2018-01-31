import { injectGlobal } from 'emotion';

injectGlobal`
  * {
    box-sizing: border-box;
    transition: all .35s;
    outline: none;
  }
  body {
    position: relative;
    -webkit-font-smoothing: antialiased;
    color: #333333;
    height: 100vh;
    background-color: white;
    font-family: Arial, Helvetica, Helvetica Neue, serif;
    overflow: hidden;
  }

  #root {
    height: 100%;
  }

  h2 {
    margin: 0;
    font-size: 2.25rem;
    font-weight: bold;
    letter-spacing: -0.025em;
    color: #fff;
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
