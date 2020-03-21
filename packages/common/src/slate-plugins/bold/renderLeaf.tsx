import React from "react"
import { BOLD } from "./types"
import { getRenderLeaf } from "@slate-plugin-system/core"

export const renderLeafBold = getRenderLeaf({
	type: BOLD,
	component: (props) => <strong>{props.children}</strong>
})
