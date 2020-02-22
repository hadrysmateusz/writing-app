import React from "react"

import { BLOCKS } from "@writing-tool/constants/src/Slate"
import FormatButton from "./FormatButton"

const Toolbar = () => {
	return (
		<div>
			{/* Headings */}
			<FormatButton format={BLOCKS.HEADING_1} />
			<FormatButton format={BLOCKS.HEADING_2} />
			&nbsp;
			{/* Common */}
			<FormatButton format={BLOCKS.BLOCKQUOTE} />
			<FormatButton format={BLOCKS.CODE} />
			<FormatButton format={BLOCKS.IMAGE} />
			&nbsp;
			{/* Lists */}
			<FormatButton format={BLOCKS.LIST_NUMBERED} />
			<FormatButton format={BLOCKS.LIST_BULLETED} />
			&nbsp;
			{/* Embeds */}
			{/* <FormatButton format={BLOCKS.EMBED} text="Embed" /> */}
		</div>
	)
}

export default Toolbar
