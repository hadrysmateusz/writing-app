import React, { useCallback } from "react"
// import { useSlateStatic } from "slate-react"

import Icon from "./Icon"
import { isFormatActive, toggleFormat } from "../slate-helpers"

const StyledButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  border-radius: none;
  padding: 6px;
  color: ${(p) => (p.active ? "white" : "inherit")};
`

   const editor = useSlateStatic()

  const defaultOnMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      toggleFormat(editor, format)
    },
    [editor, format]
  )

  return (
    <StyledButton
      active={isActive}
      onMouseDown={onMouseDown ?? defaultOnMouseDown}
    >
      {text ? text : <Icon icon={format} />}
    </StyledButton>
  )
}

export default FormatButton
