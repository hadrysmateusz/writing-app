import React from "react"
import { RenderElementProps } from "slate-react"

import { getElement } from "@writing-tool/slate-plugin-system"

import { ListType, RenderElementListOptions } from "./types"
import { StyledUL, StyledOL } from "./components"

export const renderElementList = ({
	UL = StyledUL,
	OL = StyledOL,
	LI = getElement("li")
}: RenderElementListOptions = {}) => (props: RenderElementProps) => {
	switch (props.element.type) {
		case ListType.UL_LIST:
			return <UL {...props} />
		case ListType.OL_LIST:
			return <OL {...props} />
		case ListType.LIST_ITEM:
			return <LI {...props} />
		default:
			break
	}
}
