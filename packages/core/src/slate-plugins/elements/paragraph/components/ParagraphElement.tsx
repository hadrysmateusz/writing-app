import React, { memo } from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { PARAGRAPH } from "../types"
import { Toolbar } from "../../../../components/NodeToolbar"
import { config } from "../../../../dev-tools"

const StyledParagraph = styled.div`
  position: relative;
  --margin: 14px;
  :not(:first-child) {
    margin-top: var(--margin);
  }
  :not(:last-child) {
    margin-bottom: var(--margin);
  }

  ${() =>
    config.debugStyles &&
    `border: 1px dashed blue; 
    background: rgba(0, 0, 255, 0.15); 
    padding: 4px;`}
`

export const ParagraphElement = memo(
  (props: RenderElementProps) => {
    const { attributes, children, element } = props
    return (
      <StyledParagraph {...attributes} data-slate-type={PARAGRAPH}>
        <Toolbar nodeRef={attributes.ref} slateNode={element} />
        {children}
      </StyledParagraph>
    )
  },
  (prevProps, nextProps) => {
    // TODO: this is potentially a very dangerous optimisation because the comparison is so basic
    return prevProps.element === nextProps.element
  }
)
