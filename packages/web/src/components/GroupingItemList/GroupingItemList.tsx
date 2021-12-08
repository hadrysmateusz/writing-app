import { SidebarView } from "../ViewState"

import { GroupingItemListComponentProps } from "./GroupingItemListComponent"
import { GroupsList } from "../GroupsList"
import { DirsList } from "../DirsList/DirsList"

export type GroupingItemListProps = {
  view: SidebarView<"primary">
} & GroupingItemListComponentProps

export const GroupingItemList: React.FC<GroupingItemListProps> = ({
  view,
  ...props
}) => {
  switch (view) {
    case "local":
      return <DirsList {...props} />
    case "cloud":
      return <GroupsList {...props} />
    default:
      console.error("wrong view type")
      return null
  }
}
