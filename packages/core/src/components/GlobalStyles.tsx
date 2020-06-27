import { createGlobalStyle } from "styled-components/macro"
import { normalize } from "polished"

const GlobalStyles = createGlobalStyle`
  ${normalize()}

  :root {
    /* --body-font-stack: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
      "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    --header-font-stack: 'Saira Semi Condensed', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
      "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif; */
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
  }

  /* h1,h2,h3,h4,h5,h6 {
    font-family: var(--header-font-stack);
  } */


  /* a {
    text-decoration: none;
    color: inherit;
  } */
`

export default GlobalStyles
