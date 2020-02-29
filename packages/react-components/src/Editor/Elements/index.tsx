import React from "react"

import { ELEMENTS } from "@writing-tool/constants/src/Slate"

import Paragraph from "./Paragraph"
import Blockquote from "./Blockquote"
import CodeBlock from "./CodeBlock"
import CodeInline from "./CodeInline"
import Embed from "./Embed"
import Image from "./Image"
import HR from "./HR"
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from "./Headings"
import { ListItem, NumberedList, BulletedList } from "./Lists"
import { isInline } from "../helpers"

const InlineElement = ({ children }) => {
	return children
}

const BlockElement = ({ children }) => {
	return children
}

export const renderElement = (props) => {
	const components = {
		// Inline Elements
		[ELEMENTS.CODE_INLINE]: <CodeInline {...props} />,
		// Common Blocks
		[ELEMENTS.PARAGRAPH]: <Paragraph {...props} />,
		[ELEMENTS.BLOCKQUOTE]: <Blockquote {...props} />,
		[ELEMENTS.CODE_BLOCK]: <CodeBlock {...props} />,
		// Void Blocks
		[ELEMENTS.IMAGE]: <Image {...props} />,
		[ELEMENTS.EMBED]: <Embed {...props} />,
		[ELEMENTS.HR]: <HR {...props} />,
		// Headings
		[ELEMENTS.HEADING_1]: <Heading1 {...props} />,
		[ELEMENTS.HEADING_2]: <Heading2 {...props} />,
		[ELEMENTS.HEADING_3]: <Heading3 {...props} />,
		[ELEMENTS.HEADING_4]: <Heading4 {...props} />,
		[ELEMENTS.HEADING_5]: <Heading5 {...props} />,
		[ELEMENTS.HEADING_6]: <Heading6 {...props} />,
		// Lists
		[ELEMENTS.LIST_NUMBERED]: <NumberedList {...props} />,
		[ELEMENTS.LIST_BULLETED]: <BulletedList {...props} />,
		[ELEMENTS.LIST_ITEM]: <ListItem {...props} />
	}

	const { element } = props
	const component = components[element.type]
	const isElementInline = isInline(element)
	const WrapperComponent = isElementInline ? InlineElement : BlockElement

	return <WrapperComponent>{component || <Paragraph {...props} />}</WrapperComponent>
}
