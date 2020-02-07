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

const Icons = {
	bold: FaBold,
	italic: FaItalic,
	strikethrough: FaStrikethrough,
	code: FaCode,
	link: FaLink,
	quote: FaQuoteRight,
	image: FaRegFileImage,
	listNumbered: FaListOl,
	listBulleted: FaListUl,
	heading1: Heading1,
	heading2: Heading2
}

function Icon({ icon }) {
	const iconComponent = Icons[icon]
	if (!iconComponent) console.error("invalid icon:", icon)
	return iconComponent ? <IconContainer>{React.createElement(iconComponent, null, null)}</IconContainer> : null
}

const IconContainer = styled.div``

export default Icon
