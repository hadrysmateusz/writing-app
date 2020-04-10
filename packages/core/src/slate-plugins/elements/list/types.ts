// TODO: create an extra type to differentiate between all list-related types and types of lists (excluding the list item)

export enum ListType {
	OL_LIST = "numbered_list",
	UL_LIST = "bulleted_list",
	LIST_ITEM = "list_item"
}

export interface RenderElementListOptions {
	UL?: React.ComponentType
	OL?: React.ComponentType
	LI?: React.ComponentType
}

export interface ListOptions extends RenderElementListOptions  {
  defaultType?: string
}