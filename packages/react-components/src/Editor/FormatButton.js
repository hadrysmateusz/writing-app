import React, { useCallback } from "react"
import { useSlate } from "slate-react"

import { MARKS } from "@writing-tool/constants/src/Slate"

import Icon from "../Icon"
import Button from "../Button"
import { isMarkActive, toggleMark, isBlockActive, toggleBlock } from "./helpers"

const FormatButton = ({ format, text }) => {
	const editor = useSlate()
	const isMark = Object.values(MARKS).includes(format) // INLINES and BLOCKS use the same functions so we check if it's a mark to know which functions to use
	const toggleFn = isMark ? toggleMark : toggleBlock
	const isActiveFn = isMark ? isMarkActive : isBlockActive

	const isActive = isActiveFn(editor, format)
	const onClick = useCallback(
		(event) => {
			event.preventDefault()
			toggleFn(editor, format)
		},
		[editor, format, toggleFn]
	)

	return (
		<Button active={isActive} onClick={onClick}>
			{text ? text : <Icon icon={format} />}
		</Button>
	)
}

export default FormatButton
