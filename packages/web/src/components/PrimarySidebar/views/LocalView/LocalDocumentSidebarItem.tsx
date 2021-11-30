import { useCallback } from "react"

import SidebarDocumentItemComponent from "../../../DocumentsList/SidebarDocumentItemComponent"
import { useTabsDispatch, useTabsState } from "../../../MainProvider"

import { findTabWithPath } from "./helpers"

export const LocalDocumentSidebarItem: React.FC<{
  path: string
  name: string
}> = ({ path, name }) => {
  const tabsDispatch = useTabsDispatch()
  const tabsState = useTabsState()

  const handleClick = useCallback(() => {
    const tabId = findTabWithPath(tabsState, path)
    // tab with this path already exists, switch to it
    if (tabId !== null) {
      tabsDispatch({ type: "switch-tab", tabId })
    } else {
      // check for a tab with keep === false
      const tempTab = Object.values(tabsState.tabs).find(
        (tab) => tab.keep === false
      )
      // if there is a tab with keep === false, we reuse that tab
      if (!!tempTab) {
        tabsDispatch({
          type: "replace-tab",
          tab: {
            tabId: tempTab.tabId,
            tabType: "localDocument",
            path: path,
            keep: false,
          },
          switch: true,
        })
      }
      // open document in new tab
      else {
        tabsDispatch({
          type: "create-tab",
          tabType: "localDocument",
          path: path,
          switch: true,
        })
      }
    }
  }, [path, tabsDispatch, tabsState])

  return (
    <SidebarDocumentItemComponent
      key={path}
      title={name}
      // TODO: replace these timestamps with real data
      modifiedAt={Date.now()}
      createdAt={Date.now()}
      // TODO: add an actual isCurrent check
      isCurrent={false}
      onClick={handleClick}
    />
  )
}
