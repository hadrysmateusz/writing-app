import React from "react"
import { ITALIC } from "./types"
import { getRenderLeaf } from "@writing-tool/slate-plugins-system"

export const renderLeafItalic = getRenderLeaf({
	type: ITALIC,
	component: (props) => <em>{props.children}</em>
})
