import React from "react"
import { RenderElementProps } from "slate-react"

import { getElement } from "@writing-tool/slate-plugins-system"

import { HeadingType, RenderElementHeadingOptions } from "./types"
import { HeadingBig, HeadingSmall } from "./components"

export const renderElementHeading = ({
	levels = 6,
	H1 = HeadingBig, // level 1 is treated as a "Heading" on medium
	H2 = HeadingSmall, // level 2 is treated as a "Sub-Heading" on medium
	H3 = HeadingSmall, // level 3 is treated like level 2 on medium
	H4 = HeadingSmall, // level 4 is treated like level 2 on medium
	H5 = getElement("p"), // level 5 isn't supported on medium, it's rendered like regular text
	H6 = getElement("p") // level 6 isn't supported on medium, it's rendered like regular text
}: RenderElementHeadingOptions = {}) => (props: RenderElementProps) => {
	const {
		element: { type }
	} = props

	if (levels >= 1 && type === HeadingType.H1) return <H1 {...props} />
	if (levels >= 2 && type === HeadingType.H2) return <H2 {...props} />
	if (levels >= 3 && type === HeadingType.H3) return <H3 {...props} />
	if (levels >= 4 && type === HeadingType.H4) return <H4 {...props} />
	if (levels >= 5 && type === HeadingType.H5) return <H5 {...props} />
	if (levels >= 6 && type === HeadingType.H6) return <H6 {...props} />
}
