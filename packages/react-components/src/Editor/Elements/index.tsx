import React from "react"

import { ELEMENTS } from "@writing-tool/constants/src/Slate"

import Paragraph from "./Paragraph"
import Blockquote from "./Blockquote"
import CodeBlock from "./CodeBlock"
import Embed from "./Embed"
import Image from "./Image"
import HR from "./HR"
import { ListItem, NumberedList, BulletedList } from "./Lists"

export const renderElement = (props) => {
	const components = {
		// Common Blocks
		[ELEMENTS.PARAGRAPH]: <Paragraph {...props} />,
		[ELEMENTS.BLOCKQUOTE]: <Blockquote {...props} />,
		[ELEMENTS.CODE_BLOCK]: <CodeBlock {...props} />,
		// Void Blocks
		[ELEMENTS.IMAGE]: <Image {...props} />,
		[ELEMENTS.EMBED]: <Embed {...props} />,
		[ELEMENTS.HR]: <HR {...props} />,
		// Lists
		[ELEMENTS.LIST_NUMBERED]: <NumberedList {...props} />,
		[ELEMENTS.LIST_BULLETED]: <BulletedList {...props} />,
		[ELEMENTS.LIST_ITEM]: <ListItem {...props} />
	}

	const { element } = props
	const component = components[element.type]
	if (component) return component
}
