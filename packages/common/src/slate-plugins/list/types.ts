// TODO: create an extra type to differentiate between all list-related types and types of lists (excluding the list item)

export enum ListType {
	OL_LIST = "numbered-list",
	UL_LIST = "bulleted-list",
	LIST_ITEM = "list-item"
}

export interface RenderElementListOptions {
	UL?: React.ComponentType
	OL?: React.ComponentType
	LI?: React.ComponentType
}
