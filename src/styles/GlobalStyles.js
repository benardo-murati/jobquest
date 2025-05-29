// client/src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Global Styling */
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f2f5;
    color: #333;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyles;
