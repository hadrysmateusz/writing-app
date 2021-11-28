import React, { memo, useMemo } from "react"
import { parseSidebarPath, usePrimarySidebar } from "../../ViewState"
import { Switch, Case } from "../../Conditional"
import { LocalView } from "../views"

export const Local: React.FC = memo(() => {
  const { currentSubviews } = usePrimarySidebar()

  // TODO: probably calculate this in primarySidebar provider
  const subview = useMemo(
    () => parseSidebarPath(currentSubviews.local)?.subview,
    [currentSubviews.local]
  )

  return subview ? (
    <Switch value={subview}>
      <Case value={"all"} component={<LocalView />} />
    </Switch>
  ) : null
})
