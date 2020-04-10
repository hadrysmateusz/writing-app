import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { BLOCKQUOTE } from "../types"

const StyledBlockquote = styled.blockquote`
	border-left: 2px solid #ddd;
	margin: 14px 0;
	padding-left: 10px;
	color: #aaa;
	font-style: italic;
`

export const BlockquoteElement = ({ attributes, children }: RenderElementProps) => (
	<StyledBlockquote {...attributes} data-slate-type={BLOCKQUOTE}>
		{children}
	</StyledBlockquote>
)
