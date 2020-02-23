import React from "react"
import styled, { css } from "styled-components/macro"

import { MARKS } from "@writing-tool/constants/src/Slate"

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
	${(p) => p.leaf[MARKS.STRIKE] && strike}
`

const Leaf = ({ attributes, children, leaf }) => {
	return (
		<LeafStyles {...attributes} leaf={leaf}>
			{children}
		</LeafStyles>
	)
}

export const renderLeaf = (props) => {
	return <Leaf {...props} />
}
