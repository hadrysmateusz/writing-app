import { useCallback, useMemo } from "react"
import { Ancestor, Node } from "slate"

import { useLocalFS } from "../../../LocalFSProvider"
import {
  useContextMenu,
  ContextMenu,
  ContextMenuItem,
} from "../../../ContextMenu"
import { findTabWithPath } from "../../../PrimarySidebar/Local/helpers"
import { useTabsDispatch, useTabsState } from "../../../TabsProvider"

import SidebarDocumentItemComponent from "../SidebarDocumentItemComponent"
import { FileObject } from "shared"
import { LocalSettings } from "../../../Database"
import { myDeserializeMd } from "../../../../slate-helpers/deserialize"

export const LocalDocumentSidebarItem: React.FC<{
  file: FileObject
  listType?: LocalSettings["documentsListDisplayType"]
}> = ({
  file: { path, name, createdAt, modifiedAt, parentDirectory, content },
  listType,
}) => {
  const tabsDispatch = useTabsDispatch()
  const { tabsState, currentTabObject } = useTabsState()
  const { deleteFile, revealItem } = useLocalFS()

  const { getContextMenuProps, openMenu, isMenuOpen } = useContextMenu()

  const snippet = useMemo(() => {
    // TODO: replace with a better solution that simply limits the text to some number of lines (probably with css)

    let textContent = ""

    // we get and deserialize the content of the document
    const serializedContent = content

    // if the content field was empty or unefined we return undefined to not render a snippet
    if (!serializedContent?.trim()) return undefined

    const deserializedContent = myDeserializeMd(serializedContent)

    // the Node.nodes function operates on a slate node but the content is an array of children so we create a fake node object
    const fakeRootNode: Ancestor = {
      children: deserializedContent,
      type: "fakeRoot",
    }

    // we iterate over all of the nodes and create a string of all of their text contents until we reach a desired length
    for (let [node] of Node.nodes(fakeRootNode, {})) {
      if ("text" in node) {
        textContent += " " + node.text

        if (textContent.length >= 340) {
          break
        }
      }
    }

    return textContent.slice(0, 340)
  }, [content])

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
        listType={listType}
        key={path}
        title={name}
        snippet={snippet}
        modifiedAt={modifiedAt.getTime()}
        createdAt={createdAt.getTime()}
        groupName={parentDirectory}
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
