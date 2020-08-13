export type ExpandableChildrenRenderProps = {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
  toggle: () => void
}

export type CoreTreeItemProps = {
  icon?: string
  depth?: number
  disabled?: boolean
  isActive?: boolean
  /**
   * Means that the item should get special rendering to make it stand out
   */
  isSpecial?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void
  // TODO: allow any react event handlers and other common props to pass through
}

export type ExpandableTreeItemProps = CoreTreeItemProps & {
  hideToggleWhenEmpty?: boolean
  childNodes: React.ReactNode[]
  onBeforeExpand?: () => void
}

export type StatefulExpandableTreeItemProps = ExpandableTreeItemProps & {
  startExpanded?: boolean
}

export type StatelessExpandableTreeItemProps = ExpandableTreeItemProps & {
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export type StaticTreeItemProps = CoreTreeItemProps & {}
