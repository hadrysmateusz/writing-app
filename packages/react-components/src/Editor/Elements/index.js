import React from "react"

import Paragraph from "./Paragraph"
import Blockquote from "./Blockquote"
import CodeBlock from "./CodeBlock"
import Embed from "./Embed"
import Image from "./Image"
import HR from "./HR"
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "./Headings"
import { ListItem, NumberedList, BulletedList } from "./Lists"

const InlineElement = ({ children }) => {
	return children
}

const BlockElement = ({ children }) => {
	return children
}

export const renderElement = (props) => {
	const elements = {
		// Common Blocks
		PARAGRAPH: <Paragraph {...props} />,
		BLOCKQUOTE: <Blockquote {...props} />,
		CODE: <CodeBlock {...props} />,
		// Void Blocks
		IMAGE: <Image {...props} />,
		EMBED: <Embed {...props} />,
		HR: <HR {...props} />,
		// Headings
		HEADING_1: <Heading1 {...props} />,
		HEADING_2: <Heading2 {...props} />,
		HEADING_3: <Heading3 {...props} />,
		HEADING_4: <Heading4 {...props} />,
		HEADING_5: <Heading5 {...props} />,
		HEADING_6: <Heading6 {...props} />,
		// Lists
		LIST_ITEM: <ListItem {...props} />,
		LIST_BULLETED: <BulletedList {...props} />,
		LIST_NUMBERED: <NumberedList {...props} />
	}

	return <BlockElement>{elements[props.element.type] || <p {...props} />}</BlockElement>
}
