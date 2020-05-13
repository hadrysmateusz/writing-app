import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { BLOCKQUOTE } from "../types"

const StyledBlockquote = styled.blockquote`
  border-left: 3px solid #41474d;
  margin: 14px 0;
  padding-left: 14px;
  color: #afb3b6;
  /* font-style: italic; */
`

export const BlockquoteElement = ({
  attributes,
  children,
}: RenderElementProps) => (
  <StyledBlockquote {...attributes} data-slate-type={BLOCKQUOTE}>
    {children}
  </StyledBlockquote>
)
