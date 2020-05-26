import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { PARAGRAPH } from "../types"
import { Toolbar } from "../../../../components/NodeToolbar"

const StyledParagraph = styled.div`
  position: relative;
  --margin: 14px;
  :not(:first-child) {
    margin-top: var(--margin);
  }
  :not(:last-child) {
    margin-bottom: var(--margin);
  }
`

export const ParagraphElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  return (
    <StyledParagraph {...attributes} data-slate-type={PARAGRAPH}>
      <Toolbar nodeRef={attributes.ref} />
      {children}
    </StyledParagraph>
  )
}
