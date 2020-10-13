import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { CODE_BLOCK } from "../types"
import { Toolbar } from "../../../../components/NodeToolbar"

const StyledPre = styled.pre`
  position: relative;
  font-family: monospace;
  background-color: #2e3338;
  color: #f3f3f3;
  padding: 14px 18px;
  font-size: 15px;
  line-height: 24px;
  border-radius: 5px;
  white-space: pre-wrap;
  /* border: 1px solid #1b1f23; */
`

export const CodeBlockElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  // If there are issues with slate, try merging the pre and code html elements and use css to replicate their behavior
  return (
    <>
      <Toolbar nodeRef={attributes.ref} slateNode={element} />
      <StyledPre {...attributes} data-slate-type={CODE_BLOCK}>
        <code>{children}</code>
      </StyledPre>
    </>
  )
}
