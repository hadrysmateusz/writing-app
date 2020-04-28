import React from "react"
import { RenderElementProps, useFocused, useSelected } from "slate-react"
import styled from "styled-components/macro"
import { IMAGE } from "../types"

const StyledImage = styled.img<{ selected: boolean; focused: boolean }>`
  display: block;
  max-width: 100%;
  max-height: 20em;
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

  return (
    <div {...attributes} data-slate-type={IMAGE}>
      <div contentEditable={false}>
        <StyledImage
          src={element.url}
          alt=""
          selected={selected}
          focused={focused}
        />
      </div>
      {children}
    </div>
  )
}
