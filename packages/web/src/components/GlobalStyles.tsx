import { createGlobalStyle } from "styled-components/macro"
import { normalize } from "polished"

// TODO: These styles don't get applied before authentication because the authentication is in the web package (I think)
const GlobalStyles = createGlobalStyle`
  ${normalize()}

  :root {
    --dark-100: #131313;
    --dark-200: #1B1B1B;
    --dark-300: #1F1F1F;
    --dark-400: #242424;

    --bg-100: var(--dark-100);
    --bg-200: var(--dark-200);
    --bg-300: var(--dark-300);
    --bg-highlight: var(--dark-400);

    --tab-size: 34px;
    --tab-corner-radius: 4px;
  }

  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    /* font-family: var(--body-font-stack); */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    --bg-100: var(--dark-100);
    color: white;
    font-family: "Segoe UI", "Open sans", "sans-serif";
  }

  *:focus {
    /* TODO: replace with visible, but more visually appealing styles */
    outline: none;
  }

  /* Split Pane Styles */

  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 10px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 10px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.disabled {
    cursor: not-allowed;
  }
  
  .Resizer.disabled:hover {
    border-color: transparent;
  }

`

export default GlobalStyles
