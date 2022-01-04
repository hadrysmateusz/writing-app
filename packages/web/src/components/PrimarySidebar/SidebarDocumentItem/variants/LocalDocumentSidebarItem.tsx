import { useCallback, useMemo } from "react"

import { usePrimarySidebar } from "../../../ViewState"
import { useLocalFS } from "../../../LocalFSProvider"
import {
  useContextMenu,
  ContextMenu,
  ContextMenuItem,
} from "../../../ContextMenu"
import { findTabWithPath } from "../../../PrimarySidebar/Local/helpers"
import { useTabsDispatch, useTabsState } from "../../../TabsProvider"

import SidebarDocumentItemComponent from "../SidebarDocumentItemComponent"
import { useDocumentSnippet } from "../hooks"
import { SidebarDocumentItemProps } from "../types"

export const LocalDocumentSidebarItem: React.FC<SidebarDocumentItemProps> = ({
  document: {
    identifier,
    name,
    createdAt,
    modifiedAt,
    parentIdentifier,
    content,
  },
}) => {
  const { documentsListDisplayType } = usePrimarySidebar()
  const tabsDispatch = useTabsDispatch()
  const { tabsState, currentTabObject } = useTabsState()
  const { deleteFile, revealItem } = useLocalFS()

  const { getContextMenuProps, openMenu, isMenuOpen } = useContextMenu()

  const snippet = useDocumentSnippet(content)

  const isCurrent = useMemo(() => {
    if (currentTabObject.tabType === "localDocument") {
      // console.log(currentTabObject.path, path, currentTabObject.path === path)
      return identifier === currentTabObject.path
    } else {
      return false
    }
  }, [currentTabObject, identifier])

  const handleClick = useCallback(() => {
    // TODO: maybe extract this into an openDocument analog for local documents
    const tabId = findTabWithPath(tabsState, identifier)
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
            path: identifier,
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
          path: identifier,
          switch: true,
        })
      }
    }
  }, [identifier, tabsDispatch, tabsState])

  const handleContextMenu = useCallback(
    (e) => {
      openMenu(e)
    },
    [openMenu]
  )

  const handleRemove = useCallback(() => {
    deleteFile(identifier)
  }, [deleteFile, identifier])

  const handleRevealInExplorer = useCallback(() => {
    revealItem(identifier)
  }, [identifier, revealItem])

  return (
    <>
      <SidebarDocumentItemComponent
        listType={documentsListDisplayType}
        key={identifier}
        title={name}
        snippet={snippet}
        modifiedAt={modifiedAt}
        createdAt={createdAt}
        groupName={parentIdentifier}
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
