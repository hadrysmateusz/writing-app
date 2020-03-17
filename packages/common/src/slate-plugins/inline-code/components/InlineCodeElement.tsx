import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { CODE_INLINE } from "../types"

const StyledCode = styled.code`
	font-family: monospace;
	color: #151515;
	background: #eee;
	padding: 3px;
	font-size: 0.91em;
`

export const InlineCodeElement = ({ attributes, children }: RenderElementProps) => (
	<StyledCode {...attributes} data-slate-type={CODE_INLINE}>
		{children}
	</StyledCode>
)
