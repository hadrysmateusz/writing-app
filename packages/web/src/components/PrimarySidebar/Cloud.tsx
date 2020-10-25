import React, { memo } from "react"
import { CloudViews, useViewState } from "../ViewState"
import { Switch, Case } from "../Conditional"
import { AllDocumentsView, InboxView, TrashView, GroupView } from "./views"

export const Cloud: React.FC = memo(() => {
  const { primarySidebar } = useViewState()

  return (
    <Switch value={primarySidebar.currentSubviews.cloud}>
      <Case value={CloudViews.ALL} component={<AllDocumentsView />} />
      <Case value={CloudViews.INBOX} component={<InboxView />} />
      <Case value={CloudViews.TRASH} component={<TrashView />} />
      <Case default component={<GroupView />} />
    </Switch>
  )
})
