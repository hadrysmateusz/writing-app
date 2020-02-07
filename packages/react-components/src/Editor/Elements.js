import React from "react"

const Code = ({ attributes, children }) => {
	return (
		<pre {...attributes}>
			<code>{children}</code>
		</pre>
	)
}

const Blockquote = ({ attributes, children }) => {
	return <blockquote {...attributes}>{children}</blockquote>
}

const Heading = ({ attributes, children, level }) => {
	switch (level) {
		case 1:
			return <h1 {...attributes}>{children}</h1>
		case 2:
			return <h2 {...attributes}>{children}</h2>
		case 3:
			// level 3 is treated like level 2 on medium
			return <h3 {...attributes}>{children}</h3>
		case 4:
			// level 4 is treated like level 2 on medium
			return <h4 {...attributes}>{children}</h4>
		case 5:
			// level 5 is not supported on medium and will be rendered like regular text
			return <h5 {...attributes}>{children}</h5>
		case 6:
			// level 6 is not supported on medium and will be rendered like regular text
			return <h6 {...attributes}>{children}</h6>
		default:
			throw new Error("incorrect heading level:", level)
	}
}

const Image = ({ attributes, children }) => {
	return (
		<p {...attributes}>
			<b>IMAGE PLACEHOLDER</b>
			{children}
		</p>
	)
}

const Embed = ({ attributes, children }) => {
	return (
		<p {...attributes}>
			<b>EMBED PLACEHOLDER</b>
			{children}
		</p>
	)
}

const HorizontalRule = ({ attributes, children }) => {
	return (
		<p {...attributes}>
			<hr />
		</p>
	)
}

export const Element = (props) => {
	const { attributes, children, element } = props
	switch (element.type) {
		case "heading-one":
			return <Heading {...props} level={1} />
		case "heading-two":
			return <Heading {...props} level={2} />
		case "heading-three":
			return <Heading {...props} level={3} />
		case "heading-four":
			return <Heading {...props} level={4} />
		case "heading-five":
			return <Heading {...props} level={5} />
		case "heading-six":
			return <Heading {...props} level={6} />
		case "blockquote":
			return <Blockquote {...props} />
		case "code":
			return <Code {...props} />
		case "image":
			return <Image {...props} />
		case "embed":
			return <Embed {...props} />
		case "hr":
			return <HorizontalRule {...props} />
		case "list-item":
			return <li {...attributes}>{children}</li>
		case "bulleted-list":
			return <ul {...attributes}>{children}</ul>
		case "numbered-list":
			return <ol {...attributes}>{children}</ol>
		default:
			return <p {...attributes}>{children}</p>
	}
}
