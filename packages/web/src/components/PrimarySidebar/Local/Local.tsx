import { memo, useMemo } from "react"

import { parseSidebarPath, usePrimarySidebar } from "../../ViewState"
import { Switch, Case } from "../../Conditional"

import { DirectoryView } from "./subviews/DirectoryView"
import { AllLocalDocumentsView } from "./subviews/AllLocalDocumentsView"

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
      <Case value={"all"} component={<AllLocalDocumentsView />} />
      <Case value={"directory"} component={<DirectoryView />} />
      <Case default>
        <div>Invalid path</div>
      </Case>
    </Switch>
  ) : null
})
