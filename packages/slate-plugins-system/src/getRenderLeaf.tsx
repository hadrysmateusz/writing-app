import React from "react"
import { RenderLeafProps } from "slate-react"
import { GetRenderLeafOptions, RenderLeafOptions } from "./types"

/**
 * get generic renderLeaf with a custom component
 */
export const getRenderLeaf = ({ type, component }: GetRenderLeafOptions) => ({
	component: Component = component
}: RenderLeafOptions = {}) => ({ leaf, children }: RenderLeafProps) => {
	// If component has the specified leaf type, wrap it in the component
	if (leaf[type]) return <Component>{children}</Component>
	// If not return the children unchanged
	return children
}
