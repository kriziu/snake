import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
    transition: all .2s ease;
  }

  body {
    margin: 0;
    padding: 0;
    font-size: 1.6rem;
    font-family: Roboto;
    box-sizing: border-box;
    background-color: #131313;
    color: #eAeAeA;

    transition: all .2s ease;
  }

  html {
    font-size: 62.5%;
  }


  :root {
    // COLORS
    --color-snake: #6734eb;
    --color-head: #190059;
    --color-fruit: #e3144f;
    --color-black: #131313;
    --color-white: #eAeAeA;

    // TRANSITIONS
    --trans-default: all .2s ease;
    
    // SHADOWS
    --shadow-default: 0px 5px 30px 2px rgba(0, 0, 0, 0.2);
  }
`;

export default GlobalStyle;
