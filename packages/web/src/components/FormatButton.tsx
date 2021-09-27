// import React, { useCallback } from "react"
// import { useSlateStatic } from "slate-react"
// import styled from "styled-components/macro"

// import Icon from "./Icon"
// import { isFormatActive, toggleFormat } from "../slate-helpers"

// const StyledButton = styled.button<{ active: boolean }>`
//   background: none;
//   border: none;
//   border-radius: none;
//   padding: 6px;
//   color: ${(p) => (p.active ? "white" : "inherit")};
// `

const FormatButton = ({
  format,
  text,
  onMouseDown,
}: {
  format: string
  text?: string
  onMouseDown?: (event: React.MouseEvent) => void
}) => {
  // const editor = useSlateStatic()
  // const isActive = isFormatActive(editor, format)

  // const defaultOnMouseDown = useCallback(
  //   (event: React.MouseEvent) => {
  //     event.preventDefault()
  //     toggleFormat(editor, format)
  //   },
  //   [editor, format]
  // )

  // return (
  //   <StyledButton
  //     active={isActive}
  //     onMouseDown={onMouseDown ?? defaultOnMouseDown}
  //   >
  //     {text ? text : <Icon icon={format} />}
  //   </StyledButton>
  // )
  return <div />
}

export default FormatButton
