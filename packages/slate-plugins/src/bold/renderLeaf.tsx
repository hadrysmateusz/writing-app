import React from "react"
import { BOLD } from "./types"
import { getRenderLeaf } from "@writing-tool/slate-plugins-system"

export const renderLeafBold = getRenderLeaf({
	type: BOLD,
	component: (props) => <strong>{props.children}</strong>
})
