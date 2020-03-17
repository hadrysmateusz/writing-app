import React from "react"
import { CODE_INLINE } from "./types"
import { getRenderLeaf } from "@writing-tool/slate-plugin-system"
import styled from "styled-components/macro"

const StyledCode = styled.code`
	font-family: monospace;
	color: #151515;
	background: #eee;
	padding: 3px;
	font-size: 0.91em;
`

export const renderLeafInlineCode = getRenderLeaf({
	type: CODE_INLINE,
	component: (props) => <StyledCode>{props.children}</StyledCode>
})
