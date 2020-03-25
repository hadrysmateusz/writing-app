export enum HeadingType {
	H1 = "heading_1",
	H2 = "heading_2",
	H3 = "heading_3",
	H4 = "heading_4",
	H5 = "heading_5",
	H6 = "heading_6"
}

export interface RenderElementHeadingOptions {
	levels?: number
	H1?: any
	H2?: any
	H3?: any
	H4?: any
	H5?: any
	H6?: any
}

export interface HeadingsPluginOptions extends RenderElementHeadingOptions {}
