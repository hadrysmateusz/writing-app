import React from "react"
import styled from "styled-components/macro"
import {
	FaBold,
	FaItalic,
	FaStrikethrough,
	FaCode,
	FaLink,
	FaQuoteRight,
	FaRegFileImage,
	FaListOl,
	FaListUl
} from "react-icons/fa"

import { ReactComponent as Heading1 } from "../Assets/Heading1.svg"
import { ReactComponent as Heading2 } from "../Assets/Heading2.svg"

import { BLOCKS, MARKS, INLINES } from "@writing-tool/constants/src/Slate"

const Icons = {
	[MARKS.BOLD]: FaBold,
	[MARKS.ITALIC]: FaItalic,
	[MARKS.STRIKE]: FaStrikethrough,
	[MARKS.CODE]: FaCode,
	[INLINES.LINK]: FaLink,
	[BLOCKS.CODE]: FaCode,
	[BLOCKS.BLOCKQUOTE]: FaQuoteRight,
	[BLOCKS.IMAGE]: FaRegFileImage,
	[BLOCKS.LIST_NUMBERED]: FaListOl,
	[BLOCKS.LIST_BULLETED]: FaListUl,
	[BLOCKS.HEADING_1]: Heading1,
	[BLOCKS.HEADING_2]: Heading2
}

function Icon({ icon }) {
	const iconComponent = Icons[icon]
	if (!iconComponent) console.error("invalid icon:", icon)
	return iconComponent ? (
		<IconContainer>{React.createElement(iconComponent, null, null)}</IconContainer>
	) : null
}

const IconContainer = styled.div``

export default Icon
