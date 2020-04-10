import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { PARAGRAPH } from "../types"

const StyledParagraph = styled.div`
	--margin: 14px;
	:not(:first-child) {
		margin-top: var(--margin);
	}
	:not(:last-child) {
		margin-bottom: var(--margin);
	}
`

export const ParagraphElement = ({ attributes, children }: RenderElementProps) => (
	<StyledParagraph {...attributes} data-slate-type={PARAGRAPH}>
		{children}
	</StyledParagraph>
)
