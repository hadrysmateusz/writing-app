import React, { memo, useMemo } from "react"
import { parseSidebarPath, useViewState } from "../ViewState"
import { Switch, Case } from "../Conditional"
import { TagsView } from "./views"

export const Tags: React.FC = memo(() => {
  const { primarySidebar } = useViewState()

  // TODO: probably calculate this in primarySidebar provider (also: split sidebar providers)
  const subview = useMemo(
    () => parseSidebarPath(primarySidebar.currentSubviews.tags)?.subview,
    [primarySidebar.currentSubviews.tags]
  )

  return subview ? (
    <Switch value={subview}>
      <Case value={"all"} component={<TagsView />} />
    </Switch>
  ) : null
})
