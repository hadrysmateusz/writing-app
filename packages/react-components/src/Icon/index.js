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

import { ELEMENTS, MARKS } from "@writing-tool/constants/src/Slate"

const Icons = {
	[MARKS.BOLD]: FaBold,
	[MARKS.ITALIC]: FaItalic,
	[MARKS.STRIKE]: FaStrikethrough,
	[ELEMENTS.LINK]: FaLink,
	[ELEMENTS.CODE_BLOCK]: FaCode,
	[ELEMENTS.CODE_INLINE]: FaCode,
	[ELEMENTS.BLOCKQUOTE]: FaQuoteRight,
	[ELEMENTS.IMAGE]: FaRegFileImage,
	[ELEMENTS.LIST_NUMBERED]: FaListOl,
	[ELEMENTS.LIST_BULLETED]: FaListUl,
	[ELEMENTS.HEADING_1]: Heading1,
	[ELEMENTS.HEADING_2]: Heading2
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
