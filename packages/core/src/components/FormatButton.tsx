import React, { useCallback } from "react"
import { useSlate } from "slate-react"

import Icon from "./Icon"
import Button from "./Button"
import { isFormatActive, toggleFormat } from "../slate-helpers"

const FormatButton = ({
  format,
  text,
  onMouseDown,
}: {
  format: string
  text?: string
  onMouseDown?: (event: React.MouseEvent) => void
}) => {
  const editor = useSlate()
  const isActive = isFormatActive(editor, format)

  const defaultOnMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      toggleFormat(editor, format)
    },
    [editor, format]
  )

  return (
    <Button active={isActive} onMouseDown={onMouseDown ?? defaultOnMouseDown}>
      {text ? text : <Icon icon={format} />}
    </Button>
  )
}

export default FormatButton
