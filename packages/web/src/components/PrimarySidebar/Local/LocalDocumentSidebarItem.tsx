import { useCallback, useMemo } from "react"

import SidebarDocumentItemComponent from "../../DocumentsList/SidebarDocumentItemComponent"
import { useLocalFS } from "../../LocalFSProvider"
import { useTabsDispatch, useTabsState } from "../../MainProvider"
import {
  useContextMenu,
  ContextMenu,
  ContextMenuItem,
} from "../../NewContextMenu"

import { findTabWithPath } from "./helpers"

export const LocalDocumentSidebarItem: React.FC<{
  path: string
  name: string
}> = ({ path, name }) => {
  const tabsDispatch = useTabsDispatch()
  const tabsState = useTabsState()
  const { deleteFile, revealItem } = useLocalFS()
  const { tabs, currentTab } = useTabsState()

  const { getContextMenuProps, openMenu, isMenuOpen } = useContextMenu()

  const isCurrent = useMemo(() => {
    let currentTabObj = tabs[currentTab]
    // TODO: probably precompute this and expose in useTabsState hook
    const currentTabType = currentTabObj.tabType

    if (currentTabType === "localDocument") {
      console.log(currentTabObj.path, path, currentTabObj.path === path)
      return path === currentTabObj.path
    } else {
      return false
    }
  }, [currentTab, path, tabs])

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

  const handleContextMenu = useCallback(
    (e) => {
      openMenu(e)
    },
    [openMenu]
  )

  const handleRemove = useCallback(() => {
    deleteFile(path)
  }, [deleteFile, path])

  const handleRevealInExplorer = useCallback(() => {
    revealItem(path)
  }, [path, revealItem])

  return (
    <>
      <SidebarDocumentItemComponent
        key={path}
        title={name}
        // TODO: replace these timestamps with real data
        modifiedAt={Date.now()}
        createdAt={Date.now()}
        isCurrent={isCurrent}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      />
      {isMenuOpen ? (
        <ContextMenu {...getContextMenuProps()}>
          <ContextMenuItem
            text="Reveal in Explorer"
            /* TODO: use OS-agnostic naming */ onClick={handleRevealInExplorer}
          />
          <ContextMenuItem text="Delete" onClick={handleRemove} />
        </ContextMenu>
      ) : null}
    </>
  )
}
