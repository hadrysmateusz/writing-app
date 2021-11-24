import React, { memo, useMemo } from "react"
import { parseSidebarPath, usePrimarySidebar } from "../ViewState"
import { Switch, Case } from "../Conditional"
import { AllDocumentsView, InboxView, TrashView, GroupView } from "./views"
import { TagView } from "./views/TagView"

export const Cloud: React.FC = memo(() => {
  const { currentSubviews } = usePrimarySidebar()

  // TODO: probably calculate this in primarySidebar provider (also: split sidebar providers)
  const subview = useMemo(
    () => parseSidebarPath(currentSubviews.cloud)?.subview,
    [currentSubviews.cloud]
  )
  // console.log(primarySidebar)
  // console.log(primarySidebar.currentSubviews.cloud)
  // console.log(parseSidebarPath(primarySidebar.currentSubviews.cloud))
  // console.log("subview", subview)

  return subview ? (
    <Switch value={subview}>
      <Case value={"all"} component={<AllDocumentsView />} />
      <Case value={"inbox"} component={<InboxView />} />
      <Case value={"trash"} component={<TrashView />} />
      <Case value={"group"} component={<GroupView />} />
      <Case value={"tag"} component={<TagView />} />
      <Case default>
        <div>Invalid path</div>
      </Case>
    </Switch>
  ) : null
})
