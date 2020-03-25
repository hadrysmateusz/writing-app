import React from "react"
import { ITALIC } from "./types"
import { getRenderLeaf } from "@slate-plugin-system/core"

export const renderLeafItalic = getRenderLeaf({
	type: ITALIC,
	component: (props) => <em>{props.children}</em>
})
