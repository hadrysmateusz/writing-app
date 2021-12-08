export type ChangeViewFn = React.Dispatch<React.SetStateAction<string>>

export enum HoverState {
  above = "above",
  below = "below",
  inside = "inside",
  outside = "outside",
}

export interface GroupHoverItem {
  type: string
  id: string
  parentId: string | null
}

export interface GroupDropResult {
  destinationId: string | null
  destinationIndex: number
}

export interface GroupDragCollectedProps {
  isDragging: boolean
}

export type ItemsBranch = {
  itemId: string
  itemName: string
  parentItemId: string | null // TODO: add actual parentItemIds for local branches
  childItems: ItemsBranch[]
}
