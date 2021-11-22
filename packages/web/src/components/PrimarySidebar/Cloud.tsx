import React, { memo, useMemo } from "react"
import { parseSidebarPath, useViewState } from "../ViewState"
import { Switch, Case } from "../Conditional"
import { AllDocumentsView, InboxView, TrashView, GroupView } from "./views"

export const Cloud: React.FC = memo(() => {
  const { primarySidebar } = useViewState()

  const subview = useMemo(
    () => parseSidebarPath(primarySidebar.currentSubviews.cloud)?.subview,
    [primarySidebar.currentSubviews.cloud]
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
      <Case default>
        <div>Invalid path</div>
      </Case>
    </Switch>
  ) : null
})
