import { FC, useCallback, useMemo } from "react"

import { useMainState, useTabsState } from "../MainProvider"

import {
  CloudDocumentEditorTab,
  CloudNewEditorTab,
  LocalDocumentEditorTab,
} from "./SpecializedTabs"

const EditorTab: FC<{ tabId: string }> = ({ tabId }) => {
  const tabsState = useTabsState()
  const { closeTab, tabsDispatch } = useMainState()

  const isActive = tabsState.currentTab === tabId
  const tab = useMemo(() => tabsState.tabs[tabId], [tabId, tabsState.tabs])

  const handleSwitchTab = useCallback(
    (_e: React.MouseEvent) => {
      if (isActive) {
        return
      }
      tabsDispatch({ type: "switch-tab", tabId })
    },
    [isActive, tabId, tabsDispatch]
  )

  const handleCloseTab = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      closeTab(tab.tabId)
    },
    [closeTab, tab.tabId]
  )

  switch (tab.tabType) {
    case "cloudDocument": {
      return (
        <CloudDocumentEditorTab
          tabId={tab.tabId}
          documentId={tab.documentId}
          isActive={isActive}
          keep={tab.keep}
          handleSwitchTab={handleSwitchTab}
          handleCloseTab={handleCloseTab}
        />
      )
    }
    case "cloudNew": {
      return (
        <CloudNewEditorTab
          isActive={isActive}
          keep={tab.keep}
          handleSwitchTab={handleSwitchTab}
          handleCloseTab={handleCloseTab}
        />
      )
    }
    case "localDocument": {
      return (
        <LocalDocumentEditorTab
          path={tab.path}
          isActive={isActive}
          keep={tab.keep}
          handleSwitchTab={handleSwitchTab}
          handleCloseTab={handleCloseTab}
        />
      )
    }
  }
}

export default EditorTab
