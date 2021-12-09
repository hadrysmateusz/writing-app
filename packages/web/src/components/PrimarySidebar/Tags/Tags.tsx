import { memo, useMemo } from "react"

import { parseSidebarPath, usePrimarySidebar } from "../../ViewState"
import { Switch, Case } from "../../Conditional"

import { TagsView } from "./subviews/TagsView"

export const Tags: React.FC = memo(() => {
  const { currentSubviews } = usePrimarySidebar()

  // TODO: probably calculate this in primarySidebar provider
  const subview = useMemo(
    () => parseSidebarPath(currentSubviews.tags)?.subview,
    [currentSubviews.tags]
  )

  return subview ? (
    <Switch value={subview}>
      <Case value={"all"} component={<TagsView />} />
    </Switch>
  ) : null
})
