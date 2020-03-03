import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { CODE_INLINE } from "../types"

const StyledCode = styled.code`
	display: inline-block;
	font-family: monospace;
	background-color: #f5f5f5;
	color: #111;
	padding: 3px 6px;
	border-radius: 5px;
`

export const InlineCodeElement = ({ attributes, children }: RenderElementProps) => (
	<StyledCode {...attributes} data-slate-type={CODE_INLINE}>
		{children}
	</StyledCode>
)
