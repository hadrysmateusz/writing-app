import React from "react"
import { RenderElementProps, useFocused, useSelected } from "slate-react"
import styled from "styled-components/macro"
import { IMAGE } from "../types"
import escapeHtml from "escape-html"

const StyledImage = styled.img<{ selected: boolean; focused: boolean }>`
  display: block;
  max-width: 100%;
  margin: 10px 0;
  box-shadow: ${(props) =>
    props.selected && props.focused ? "0 0 0 3px #B4D5FF" : "none"};
`

export const ImageElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected()
  const focused = useFocused()

  // TODO: handle missing or broken urls
  const src = typeof element.url === "string" ? escapeHtml(element.url) : ""

  return (
    <div {...attributes} data-slate-type={IMAGE}>
      <div contentEditable={false}>
        <StyledImage src={src} alt="" selected={selected} focused={focused} />
      </div>
      {children}
    </div>
  )
}
