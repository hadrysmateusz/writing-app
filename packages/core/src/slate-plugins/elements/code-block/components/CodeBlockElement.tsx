import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { CODE_BLOCK } from "../types"

const StyledPre = styled.pre`
  position: relative;
  font-family: monospace;
  background-color: #41474d;
  color: #f3f3f3;
  padding: 14px 18px;
  font-size: 15px;
  line-height: 24px;
  border-radius: 5px;
  white-space: pre-wrap;
  border: 1px solid #1b1f23;
`

export const CodeBlockElement = ({
  attributes,
  children,
}: RenderElementProps) => (
  <StyledPre>
    <code {...attributes} data-slate-type={CODE_BLOCK}>
      {children}
    </code>
  </StyledPre>
)
