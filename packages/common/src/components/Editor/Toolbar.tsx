import React from "react"
import { useSlate } from "slate-react"

import {
	ListType,
	BLOCKQUOTE,
	CODE_BLOCK,
	HeadingType,
	toggleList
} from "../../slate-plugins"
import FormatButton from "./FormatButton"

export const Toolbar = () => {
	const editor = useSlate()

	// TODO: ListType should eventually be replaced by a type without the list item
	const onToggleList = (type: ListType) => (event: Event) => {
		event.preventDefault()
		toggleList(editor, type)
	}

	return (
		<div>
			{/* Headings */}
			<FormatButton format={HeadingType.H1} />
			<FormatButton format={HeadingType.H2} />
			&nbsp;
			{/* Common */}
			<FormatButton format={BLOCKQUOTE} />
			<FormatButton format={CODE_BLOCK} />
			{/* <FormatButton format={ELEMENTS.IMAGE} /> */}
			&nbsp;
			{/* Lists */}
			<FormatButton
				format={ListType.OL_LIST}
				onMouseDown={onToggleList(ListType.OL_LIST)}
			/>
			<FormatButton
				format={ListType.UL_LIST}
				onMouseDown={onToggleList(ListType.UL_LIST)}
			/>
			&nbsp;
			{/* Embeds */}
			{/* <FormatButton format={ELEMENTS.EMBED} text="Embed" /> */}
		</div>
	)
}
