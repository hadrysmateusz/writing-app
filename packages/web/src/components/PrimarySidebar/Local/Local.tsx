import React, { memo, useMemo } from "react"
import { parseSidebarPath, usePrimarySidebar } from "../../ViewState"
import { Switch, Case } from "../../Conditional"
import { LocalView } from "../views"
import { DirectoryView } from "../views/LocalView/DirectoryView"

export const Local: React.FC = memo(() => {
  const { currentSubviews } = usePrimarySidebar()

  // TODO: probably calculate this in primarySidebar provider
  const subview = useMemo(
    () => parseSidebarPath(currentSubviews.local)?.subview,
    [currentSubviews.local]
  )

  return subview ? (
    <Switch value={subview}>
      {/* TODO: add a view for managing saved paths (similiar to top-level tags subview) */}
      <Case value={"all"} component={<LocalView />} />
      <Case value={"directory"} component={<DirectoryView />} />
      <Case default>
        <div>Invalid path</div>
      </Case>
    </Switch>
  ) : null
})
