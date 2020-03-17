import React from "react"
import styled from "styled-components"
import { getRenderLeaf } from "@writing-tool/slate-plugins-system"
import { STRIKE } from "./types"

const Strikethrough = styled.span`
	text-decoration: line-through;
`

export const renderLeafStrikethrough = getRenderLeaf({
	type: STRIKE,
	component: (props) => <Strikethrough>{props.children}</Strikethrough>
})
