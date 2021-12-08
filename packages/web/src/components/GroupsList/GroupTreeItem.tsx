import React, { useCallback } from "react"

import {
  parseSidebarPath,
  useNavigatorSidebar,
  usePrimarySidebar,
} from "../ViewState"
import { useDocumentsAPI, useGroupsAPI } from "../MainProvider"

import { formatOptional } from "../../utils"
import { useLocalSettings } from "../LocalSettings"
import { LocalSettings } from "../Database"
import { ItemsBranch, GroupingItemTreeItemComponent } from "../GroupingItemList"

export const GroupTreeItem: React.FC<{
  item: ItemsBranch
  index: number
  depth?: number
}> = ({ item, index, depth }) => {
  const { createDocument: createCloudDocument } = useDocumentsAPI()
  const { renameGroup, removeGroup, createGroup, moveGroup } = useGroupsAPI()
  const { updateLocalSetting } = useLocalSettings()
  const { switchSubview, currentSubviews, currentView } = usePrimarySidebar()
  const { expandedKeys, setExpandedKeys } = useNavigatorSidebar()

  const view = "cloud"
  const itemId = item.itemId
  const itemName = formatOptional(item.itemName, "Unnamed Collection")
  const isEmpty = item.childItems.length === 0
  // TODO: calculate this once for the entire groups section, taking into consideration which group tree items are expanded etc. (calculate a single group.id which should be highlighted)
  const isActive = parseSidebarPath(currentSubviews[currentView])?.id === itemId

  const createItem = useCallback(
    (values) => {
      return createGroup(itemId, values)
    },
    [createGroup, itemId]
  )

  const deleteItem = useCallback(() => {
    return removeGroup(itemId)
  }, [itemId, removeGroup])

  const selectItem = useCallback(() => {
    return switchSubview("cloud", "group", itemId)
  }, [itemId, switchSubview])

  const renameItem = useCallback(
    (newName: string) => {
      return renameGroup(itemId, newName)
    },
    [itemId, renameGroup]
  )

  const moveItem = useCallback(
    (movedItemId: string, destinationId: string, destinationIndex: number) => {
      return moveGroup(movedItemId, destinationIndex, destinationId)
    },
    [moveGroup]
  )

  const createDocument = useCallback(() => {
    return createCloudDocument({ parentGroup: itemId })
  }, [createCloudDocument, itemId])

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
      itemName={itemName}
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
    />
  )
}

export default GroupTreeItem
