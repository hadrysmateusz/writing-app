import React from "react"

import { ELEMENTS } from "@writing-tool/constants/src/Slate"
import FormatButton from "./FormatButton"

export const Toolbar = () => {
	return (
		<div>
			{/* Headings */}
			<FormatButton format={ELEMENTS.HEADING_1} />
			<FormatButton format={ELEMENTS.HEADING_2} />
			&nbsp;
			{/* Common */}
			<FormatButton format={ELEMENTS.BLOCKQUOTE} />
			<FormatButton format={ELEMENTS.CODE_BLOCK} />
			<FormatButton format={ELEMENTS.IMAGE} />
			&nbsp;
			{/* Lists */}
			<FormatButton format={ELEMENTS.LIST_NUMBERED} />
			<FormatButton format={ELEMENTS.LIST_BULLETED} />
			&nbsp;
			{/* Embeds */}
			{/* <FormatButton format={ELEMENTS.EMBED} text="Embed" /> */}
		</div>
	)
}
