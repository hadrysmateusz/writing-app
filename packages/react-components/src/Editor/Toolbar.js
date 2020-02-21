import React from "react"
import { useSlate } from "slate-react"

import { isBlockActive, toggleBlock, isMarkActive, toggleMark } from "./helpers"

import Icon from "../Icon"

const Toolbar = () => {
	return (
		<div>
			<div>
				{/* Headings */}
				<BlockButton format="heading1">h1</BlockButton>
				<BlockButton format="heading2">h2</BlockButton>
				{/* Common */}
				<BlockButton format="code">
					<Icon icon="code" />
				</BlockButton>
				<BlockButton format="blockquote">
					<Icon icon="quote" />
				</BlockButton>
				<BlockButton format="image">
					<Icon icon="image" />
				</BlockButton>
				{/* Lists */}
				<BlockButton format="numbered-list">
					<Icon icon="listNumbered" />
				</BlockButton>
				<BlockButton format="bulleted-list">
					<Icon icon="listBulleted" />
				</BlockButton>
				{/* Embeds */}
				<BlockButton format="embed">Embed</BlockButton>
			</div>

			<div>
				<MarkButton format="bold">
					<Icon icon="bold" />
				</MarkButton>
				<MarkButton format="italic">
					<Icon icon="italic" />
				</MarkButton>
				<MarkButton format="strikethrough">
					<Icon icon="strikethrough" />
				</MarkButton>
				<MarkButton format="code">
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
