// TODO: move to constants
// TODO: consider replacing with an enum
export const VIEWS = {
  ALL: "__ALL_DOCUMENTS__",
  TRASH: "__TRASH__",
  INBOX: "__INBOX__",
}

export const SECONDARY_VIEWS = {
  SNIPPETS: "__SNIPPETS__",
}

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
