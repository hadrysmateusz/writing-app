import { GroupTreeItem } from "../GroupsList"
import { DirTreeItem } from "../DirsList"
import { SidebarView } from "../ViewState"

import { ItemsBranch } from "./types"

export type GroupingItemTreeItemProps = { view: SidebarView<"primary"> } & {
  item: ItemsBranch
  index: number
  depth?: number
}

export const GroupingItemTreeItem: React.FC<GroupingItemTreeItemProps> = ({
  view,
  ...props
}) => {
  switch (view) {
    case "local":
      return <DirTreeItem {...props} />
    case "cloud":
      return <GroupTreeItem {...props} />
    default:
      console.error("wrong view type")
      return null
  }
}
