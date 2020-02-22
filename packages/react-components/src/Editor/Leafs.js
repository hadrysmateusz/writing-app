import React from "react"
import styled, { css } from "styled-components/macro"

import { MARKS } from "@writing-tool/constants/src/Slate"

const code = css`
	display: inline-block;
	font-family: monospace;
	background-color: #f5f5f5;
	color: #111;
	padding: 3px 6px;
	border-radius: 5px;
`

const bold = css`
	font-weight: bold;
`

const italic = css`
	font-style: italic;
`

const strike = css`
	text-decoration: line-through;
`

const LeafStyles = styled.span`
	${(p) => p.leaf[MARKS.BOLD] && bold}
	${(p) => p.leaf[MARKS.ITALIC] && italic}
	${(p) => p.leaf[MARKS.CODE] && code}
	${(p) => p.leaf[MARKS.STRIKE] && strike}
`

export const Leaf = ({ attributes, children, leaf }) => {
	return (
		<LeafStyles {...attributes} leaf={leaf}>
			{children}
		</LeafStyles>
	)
}
