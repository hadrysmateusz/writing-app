import { useCallback, useMemo } from "react"

import { useLocalFS } from "../../../LocalFSProvider"
import {
  useContextMenu,
  ContextMenu,
  ContextMenuItem,
} from "../../../ContextMenu"
import { findTabWithPath } from "../../../PrimarySidebar/Local/helpers"
import { useTabsDispatch, useTabsState } from "../../../TabsProvider"

import SidebarDocumentItemComponent from "../SidebarDocumentItemComponent"

export const LocalDocumentSidebarItem: React.FC<{
  path: string
  name: string
}> = ({ path, name }) => {
  const tabsDispatch = useTabsDispatch()
  const { tabsState, currentTabObject } = useTabsState()
  const { deleteFile, revealItem } = useLocalFS()

  const { getContextMenuProps, openMenu, isMenuOpen } = useContextMenu()

  const isCurrent = useMemo(() => {
    if (currentTabObject.tabType === "localDocument") {
      // console.log(currentTabObject.path, path, currentTabObject.path === path)
      return path === currentTabObject.path
    } else {
      return false
    }
  }, [currentTabObject, path])

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
            onClick={handleRevealInExplorer} /* TODO: use OS-agnostic naming */
          />
          <ContextMenuItem text="Delete" onClick={handleRemove} />
        </ContextMenu>
      ) : null}
    </>
  )
}
