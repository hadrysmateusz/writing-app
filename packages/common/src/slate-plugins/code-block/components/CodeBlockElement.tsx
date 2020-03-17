import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { CODE_BLOCK } from "../types"

const StyledPre = styled.pre`
	font-family: monospace;
	background-color: #f5f5f5;
	color: #111;
	padding: 8px;
	border-radius: 5px;
	white-space: pre-wrap;
`

export const CodeBlockElement = ({ attributes, children }: RenderElementProps) => (
	<StyledPre>
		<code {...attributes} data-slate-type={CODE_BLOCK}>
			{children}
		</code>
	</StyledPre>
)
