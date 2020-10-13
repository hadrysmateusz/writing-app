import { SimplifiedToggleableHooks } from "../../hooks"

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

export type ExpandableTreeItemProps = CoreTreeItemProps &
  SimplifiedToggleableHooks & {
    nested: (depth: number) => React.ReactNode
  }

export type StatefulExpandableTreeItemProps = ExpandableTreeItemProps & {
  startExpanded?: boolean
}

export type StatelessExpandableTreeItemProps = ExpandableTreeItemProps & {
  isExpanded: boolean
  setIsExpanded:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void)
}

export type StaticTreeItemProps = CoreTreeItemProps & {}
