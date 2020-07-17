// TODO: create an extra type to differentiate between all list-related types and types of lists (excluding the list item)

export interface RenderElementListOptions {
  UL?: React.ComponentType
  OL?: React.ComponentType
  LI?: React.ComponentType
}

export interface ListOptions extends RenderElementListOptions {
  defaultType?: string
}
