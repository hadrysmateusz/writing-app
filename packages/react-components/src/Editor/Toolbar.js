import React from "react"
import { useSlate } from "slate-react"

import { isBlockActive, toggleBlock, isMarkActive, toggleMark } from "./helpers"
import { BLOCKS, MARKS } from "@writing-tool/constants/src/Slate"

import Icon from "../Icon"

const Toolbar = () => {
	return (
		<div>
			<div>
				{/* Headings */}
				<BlockButton format={BLOCKS.HEADING_1}>h1</BlockButton>
				<BlockButton format={BLOCKS.HEADING_2}>h2</BlockButton>
				&nbsp;
				{/* Common */}
				<BlockButton format={BLOCKS.BLOCKQUOTE}>
					<Icon icon="quote" />
				</BlockButton>
				<BlockButton format={BLOCKS.CODE}>
					<Icon icon="code" />
				</BlockButton>
				<BlockButton format={BLOCKS.IMAGE}>
					<Icon icon="image" />
				</BlockButton>
				&nbsp;
				{/* Lists */}
				<BlockButton format={BLOCKS.LIST_NUMBERED}>
					<Icon icon="listNumbered" />
				</BlockButton>
				<BlockButton format={BLOCKS.LIST_BULLETED}>
					<Icon icon="listBulleted" />
				</BlockButton>
				&nbsp;
				{/* Embeds */}
				<BlockButton format={BLOCKS.EMBED}>Embed</BlockButton>
			</div>

			<div>
				<MarkButton format={MARKS.BOLD}>
					<Icon icon="bold" />
				</MarkButton>
				<MarkButton format={MARKS.ITALIC}>
					<Icon icon="italic" />
				</MarkButton>
				<MarkButton format={MARKS.STRIKE}>
					<Icon icon="strikethrough" />
				</MarkButton>
				<MarkButton format={MARKS.CODE}>
					<Icon icon="code" />
				</MarkButton>
			</div>
		</div>
	)
}

const MarkButton = ({ format, children }) => {
	const editor = useSlate()
	return (
		<Button
			active={isMarkActive(editor, format)}
			onMouseDown={(event) => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			{children}
		</Button>
	)
}

const BlockButton = ({ format, children }) => {
	const editor = useSlate()
	return (
		<Button
			active={isBlockActive(editor, format)}
			onMouseDown={(event) => {
				event.preventDefault()
				toggleBlock(editor, format)
			}}
		>
			{children}
		</Button>
	)
}

const Button = ({ active, ...props }) => {
	return <button style={{ color: active ? "green" : "black" }} {...props} />
}

export default Toolbar
