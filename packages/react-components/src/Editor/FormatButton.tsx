import React, { useCallback } from "react"
import { useSlate } from "slate-react"

import Icon from "../Icon"
import Button from "../Button"
import { isFormatActive, toggleFormat } from "./helpers"

const FormatButton = ({ format, text }) => {
	const editor = useSlate()
	const isActive = isFormatActive(editor, format)

	const onClick = useCallback(
		(event) => {
			event.preventDefault()
			toggleFormat(editor, format)
		},
		[editor, format]
	)

	return (
		<Button active={isActive} onClick={onClick}>
			{text ? text : <Icon icon={format} />}
		</Button>
	)
}

export default FormatButton
