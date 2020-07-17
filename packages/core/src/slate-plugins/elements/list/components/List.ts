import styled, { css } from "styled-components/macro"

const listCommon = css`
  margin: 14px 0;
  padding: 0;

  li {
    margin: 6px 0;
  }

  li > * {
    /* display: inline-block; */
  }

  padding-inline-start: 24px;
  margin-block-start: 0;
  margin-block-end: 0;
`

export const StyledUL = styled.ul`
  /* list-style-type: none; */
  /* li::before {
    content: "";
    color: #41474d;
    display: inline-block;
    background: #41474d;
    height: 6px;
    width: 6px;
    border-radius: 50%;
    margin-bottom: 3px;
    margin-right: 12px;
    margin-left: -1px;
  } */
  ${listCommon}
`

export const StyledOL = styled.ol`
  list-style-position: inside;
  ${listCommon}
`
