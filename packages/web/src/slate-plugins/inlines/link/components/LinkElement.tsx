import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"
import escapeHtml from "escape-html"

import { LINK } from "../types"

const StyledA = styled.a`
  color: #717171;
`

export const LinkElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const href =
    "url" in element /* typeof element.url === "string" */
      ? escapeHtml(element.url)
      : ""

  // TODO: add a way to open the url in a browser with alt+click

  return (
    <StyledA {...attributes} data-slate-type={LINK} href={href}>
      {children}
    </StyledA>
  )
}
