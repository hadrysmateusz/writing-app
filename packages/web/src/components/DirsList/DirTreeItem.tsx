import React, { useCallback } from "react"

import { formatOptional } from "../../utils"

import { useLocalSettings } from "../LocalSettings"
import { LocalSettings } from "../Database"
import { useLocalFS } from "../LocalFSProvider"
import {
  parseSidebarPath,
  useNavigatorSidebar,
  usePrimarySidebar,
} from "../ViewState"
import { GroupingItemTreeItemComponent, ItemsBranch } from "../GroupingItemList"

export const DirTreeItem: React.FC<{
  item: ItemsBranch
  index: number
  depth?: number
}> = ({ item, index, depth }) => {
  const { updateLocalSetting } = useLocalSettings()
  const { switchSubview, currentSubviews, currentView } = usePrimarySidebar()
  const { expandedKeys, setExpandedKeys } = useNavigatorSidebar()
  const {
    createDocument: createLocalDocument,
    createDir,
    deleteDir,
    revealItem: revealItemBase,
    removePath: removePathBase,
  } = useLocalFS()

  const view = "local"
  const itemId = item.itemId
  const itemName = formatOptional(item.itemName, "Unknown")
  const isEmpty = item.childItems.length === 0
  // TODO: calculate this once for the entire groups section, taking into consideration which group tree items are expanded etc. (calculate a single group.id which should be highlighted)
  const isActive = parseSidebarPath(currentSubviews[currentView])?.id === itemId

  const createItem = useCallback(
    (values = {}) => {
      console.log("create dir", values)
      const { name = "" } = values

      createDir(name, item.itemId)
    },
    [createDir, item.itemId]
  )

  // TODO: if the dir is a root dir in the library, also remove the path from library when deleting from disk
  const deleteItem = useCallback(() => {
    return deleteDir(itemId)
  }, [deleteDir, itemId])

  const selectItem = useCallback(() => {
    return switchSubview("local", "directory", itemId)
  }, [itemId, switchSubview])

  const renameItem = useCallback((newName: string) => {
    console.warn("TODO: implement")
    // return renameGroup(itemId, newName)
  }, [])

  const moveItem = useCallback(
    (movedItemId: string, destinationId: string, destinationIndex: number) => {
      console.warn("TODO: implement")
      // return moveGroup(movedItemId, destinationIndex, destinationId)
    },
    []
  )

  const revealItem = useCallback(() => {
    return revealItemBase(itemId)
  }, [itemId, revealItemBase])

  const removePath = useCallback(() => {
    return removePathBase(itemId)
  }, [itemId, removePathBase])

  const createDocument = useCallback(() => {
    return createLocalDocument(item.itemId)
  }, [createLocalDocument, item.itemId])

  const isExpanded = expandedKeys[view].includes(itemId)
  const setIsExpanded = useCallback(
    (value: boolean) => {
      let oldExpandedKeys = expandedKeys
      let newExpandedKeys: LocalSettings["expandedKeys"]

      if (value === true) {
        // This check is to ensure that there are no duplicated keys
        if (isExpanded) {
          newExpandedKeys = oldExpandedKeys
        } else {
          newExpandedKeys = {
            ...oldExpandedKeys,
            [view]: [...oldExpandedKeys[view], itemId],
          }
        }
      } else {
        newExpandedKeys = {
          ...oldExpandedKeys,
          [view]: oldExpandedKeys[view].filter((id) => id !== itemId),
        }
      }

      // TODO: merge updating local setting into the setExpandedKeys function
      setExpandedKeys(newExpandedKeys)
      updateLocalSetting("expandedKeys", newExpandedKeys)
    },
    [expandedKeys, itemId, isExpanded, setExpandedKeys, updateLocalSetting]
  )

  return (
    <GroupingItemTreeItemComponent
      depth={depth}
      index={index}
      view={view}
      parentItemId={item.parentItemId}
      itemId={itemId}
      itemName={item.exists === false ? "MISSING: " + itemName : itemName}
      childItems={item.childItems}
      isEmpty={isEmpty}
      isActive={isActive}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      createItem={createItem}
      deleteItem={deleteItem}
      selectItem={selectItem}
      renameItem={renameItem}
      moveItem={moveItem}
      createDocument={createDocument}
      revealItem={revealItem}
      removePath={removePath}
    />
  )
}

export default DirTreeItem
