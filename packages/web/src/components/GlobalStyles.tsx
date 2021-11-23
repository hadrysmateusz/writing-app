import { createGlobalStyle } from "styled-components/macro"
import { normalize } from "polished"

// TODO: These styles don't get applied before authentication because the authentication is in the web package (I think)
const GlobalStyles = createGlobalStyle`
  ${normalize()}

  :root {
    --dark-100: #0e0e0e;
    --dark-200: #191919;
    --dark-300: #202020;
    --dark-400: #262626;
    --dark-500: #373737;
    --dark-600: #545454;

    --light-100: #737373;
    --light-200: #858585;
    --light-300: #a6a6a6;
    --light-400: #cbcbcb;
    --light-500: #e8e8e8;
    --light-600: #f6f6f6;

    --danger-100: ;
    --danger-200: #db4141;
    --danger-300: ;

    --selection-color: #9cb8c5;

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


// #region prismjs styles
code[class*=language-],pre[class*=language-]{color:#f8f8f2;background:0 0;text-shadow:0 1px rgba(0,0,0,.3);font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto;border-radius:.3em}:not(pre)>code[class*=language-],pre[class*=language-]{background:#272822}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em;white-space:normal}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#8292a2}.token.punctuation{color:#f8f8f2}.token.namespace{opacity:.7}.token.constant,.token.deleted,.token.property,.token.symbol,.token.tag{color:#f92672}.token.boolean,.token.number{color:#ae81ff}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string{color:#a6e22e}.language-css .token.string,.style .token.string,.token.entity,.token.operator,.token.url,.token.variable{color:#f8f8f2}.token.atrule,.token.attr-value,.token.class-name,.token.function{color:#e6db74}.token.keyword{color:#66d9ef}.token.important,.token.regex{color:#fd971f}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}
// #endregion





  /* Split Pane Styles */

  /* .Resizer {
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
    border-top: 5px solid rgba(0, 0, 0, 0);
    border-bottom: 5px solid rgba(0, 0, 0, 0);
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
    border-left: 5px solid rgba(0, 0, 0, 0);
    border-right: 5px solid rgba(0, 0, 0, 0);
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
  } */

`

export default GlobalStyles
