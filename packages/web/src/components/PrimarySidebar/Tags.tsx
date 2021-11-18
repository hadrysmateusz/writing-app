import React, { memo } from "react"
import { TagsViews, useViewState } from "../ViewState"
import { Switch, Case } from "../Conditional"
import { TagsView } from "./views"

export const Tags: React.FC = memo(() => {
  const { primarySidebar } = useViewState()

  return (
    <Switch value={primarySidebar.currentSubviews.tags}>
      <Case value={TagsViews.ALL} component={<TagsView />} />
    </Switch>
  )
})
