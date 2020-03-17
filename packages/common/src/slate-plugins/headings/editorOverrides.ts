import { withBreakInsertDefault } from "../../slate-helpers"

import { HeadingType } from "./types"

export const withHeadings = withBreakInsertDefault({
	types: [
		HeadingType.H1,
		HeadingType.H2,
		HeadingType.H3,
		HeadingType.H4,
		HeadingType.H5,
		HeadingType.H6
	]
})
