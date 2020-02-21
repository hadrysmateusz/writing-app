import React from "react"

import { BLOCKS } from "@writing-tool/constants/src/Slate"

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
		[BLOCKS.PARAGRAPH]: <Paragraph {...props} />,
		[BLOCKS.BLOCKQUOTE]: <Blockquote {...props} />,
		[BLOCKS.CODE]: <CodeBlock {...props} />,
		// Void Blocks
		[BLOCKS.IMAGE]: <Image {...props} />,
		[BLOCKS.EMBED]: <Embed {...props} />,
		[BLOCKS.HR]: <HR {...props} />,
		// Headings
		[BLOCKS.HEADING_1]: <Heading1 {...props} />,
		[BLOCKS.HEADING_2]: <Heading2 {...props} />,
		[BLOCKS.HEADING_3]: <Heading3 {...props} />,
		[BLOCKS.HEADING_4]: <Heading4 {...props} />,
		[BLOCKS.HEADING_5]: <Heading5 {...props} />,
		[BLOCKS.HEADING_6]: <Heading6 {...props} />,
		// Lists
		[BLOCKS.LIST_NUMBERED]: <NumberedList {...props} />,
		[BLOCKS.LIST_BULLETED]: <BulletedList {...props} />,
		[BLOCKS.LIST_ITEM]: <ListItem {...props} />
	}

	return <BlockElement>{elements[props.element.type] || <p {...props} />}</BlockElement>
}
