import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { BLOCKQUOTE } from "../types"

import { Toolbar } from "../../../../components/NodeToolbar"

const StyledBlockquote = styled.blockquote<{ isSelected?: boolean }>`
  border-left: 3px solid #41474d;
  position: relative;
  margin: 14px 0;
  padding-left: 14px;
  color: #afb3b6;
`

export const BlockquoteElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  return (
    <StyledBlockquote {...attributes} data-slate-type={BLOCKQUOTE}>
      {children}
      <Toolbar nodeRef={attributes.ref} />
    </StyledBlockquote>
  )
}
