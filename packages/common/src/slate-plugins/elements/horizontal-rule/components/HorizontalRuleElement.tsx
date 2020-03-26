import React from "react"
import { RenderElementProps } from "slate-react"
import styled from "styled-components/macro"

import { HORIZONTAL_RULE } from "../types"

const StyledHR = styled.hr``

export const HorizontalRuleElement = ({ attributes, children }: RenderElementProps) => (
	<StyledHR {...attributes} data-slate-type={HORIZONTAL_RULE} />
)
