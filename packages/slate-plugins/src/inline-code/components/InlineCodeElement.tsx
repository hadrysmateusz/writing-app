import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { CODE_INLINE } from "../types"

const StyledCode = styled.code`
	--padding: 5px;

	display: inline-block;
	font-family: monospace;
	background-color: #efefef;
	color: #111;
	padding: var(--padding);
	border-radius: 5px;
	font-size: 0.9em;
`

export const InlineCodeElement = ({ attributes, children }: RenderElementProps) => (
	<StyledCode {...attributes} data-slate-type={CODE_INLINE}>
		{children}
	</StyledCode>
)
