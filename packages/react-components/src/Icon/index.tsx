import React from "react"
import styled from "styled-components/macro"
import {
	FaBold,
	FaItalic,
	FaStrikethrough,
	FaCode,
	FaLink,
	FaQuoteRight,
	// FaRegFileImage,
	FaListOl,
	FaListUl
} from "react-icons/fa"

import { ReactComponent as Heading1 } from "../Assets/Heading1.svg"
import { ReactComponent as Heading2 } from "../Assets/Heading2.svg"

import {
	ListType,
	BLOCKQUOTE,
	CODE_BLOCK,
	HeadingType,
	LINK,
	BOLD,
	ITALIC,
	STRIKE,
	CODE_INLINE
} from "@writing-tool/slate-plugins"

const Icons = {
	[BOLD]: FaBold,
	[ITALIC]: FaItalic,
	[STRIKE]: FaStrikethrough,
	[CODE_INLINE]: FaCode,
	[LINK]: FaLink,
	[CODE_BLOCK]: FaCode,
	[BLOCKQUOTE]: FaQuoteRight,
	// [ELEMENTS.IMAGE]: FaRegFileImage,
	[ListType.OL_LIST]: FaListOl,
	[ListType.UL_LIST]: FaListUl,
	[HeadingType.H1]: Heading1,
	[HeadingType.H2]: Heading2
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
