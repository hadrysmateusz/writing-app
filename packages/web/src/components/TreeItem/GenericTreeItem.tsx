import { FC } from "react"
import { ExpandableTreeItem, StatelessExpandableTreeItem, TreeItem } from "."
import { GenericTreeItemProps } from "./types"

/**
 * Generic component that handles infering the correct tree item type from props and rendering it
 */
export const GenericTreeItem: FC<GenericTreeItemProps> = (props) => {
  const isExpandable = "nested" in props
  const isStateful = !("isExpanded" in props)

  if (!isExpandable) {
    return <TreeItem {...props} />
  } else {
    if (isStateful) {
      return <ExpandableTreeItem {...props} />
    } else {
      return <StatelessExpandableTreeItem {...props} />
    }
  }
}
