import React from "react"
import styled, { css } from "styled-components/macro"

const title = css`
	display: inline-block;
	font-weight: bold;
	font-size: 20px;
	margin: 20px 0 10px 0;
`

const list = css`
	padding-left: 10px;
	font-size: 20px;
	line-height: 10px;
`

const hr = css`
	display: block;
	text-align: center;
	border-bottom: 2px solid #ddd;
`

const blockquote = css`
	display: inline-block;
	border-left: 2px solid #ddd;
	padding-left: 10px;
	color: #aaa;
	font-style: italic;
`

const code = css`
	font-family: monospace;
	background-color: #eee;
	padding: 3px;
`

const bold = css`
	font-weight: bold;
`

const italic = css`
	font-style: italic;
`

const LeafStyles = styled.span`
	${(p) => p.leaf.bold && bold}
	${(p) => p.leaf.italic && italic}
	${(p) => p.leaf.title && title}
	${(p) => p.leaf.list && list}
	${(p) => p.leaf.hr && hr}
	${(p) => p.leaf.blockquote && blockquote}
	${(p) => p.leaf.code && code}
`

export const Leaf = ({ attributes, children, leaf }) => {
	return (
		<LeafStyles {...attributes} leaf={leaf}>
			{children}
		</LeafStyles>
	)
}
