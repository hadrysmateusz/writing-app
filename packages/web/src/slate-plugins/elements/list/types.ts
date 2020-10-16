// TODO: create an extra type to differentiate between all list-related types and types of lists (excluding the list item)

import { RenderElementProps } from "slate-react"

export interface RenderElementListOptions {
  UL?: React.ComponentType<RenderElementProps>
  OL?: React.ComponentType<RenderElementProps>
  LI?: React.ComponentType<RenderElementProps>
}

export interface ListOptions extends RenderElementListOptions {
  defaultType?: string
}
