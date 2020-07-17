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
  // TODO: when inside a code block handle line breaks like soft-breaks because otherwise it creates a separate block for every line

  return (
    <StyledPre>
      <Toolbar nodeRef={attributes.ref} slateNode={element} />
      <code {...attributes} data-slate-type={CODE_BLOCK}>
        {children}
      </code>
    </StyledPre>
  )
}
