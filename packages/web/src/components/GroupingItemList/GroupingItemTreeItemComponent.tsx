import React, { useCallback, useState, memo } from "react"

import { GenericTreeItem, GenericAddButton } from "../TreeItem"
import {
  useContextMenu,
  ContextMenuItem,
  ContextSubmenu,
} from "../ContextMenu/Old"
import { ContextMenuSeparator } from "../ContextMenu/Common"
import { useEditableText, EditableText } from "../RenamingInput"
import { SidebarView } from "../ViewState"

import { HoverState, ItemsBranch } from "./types"
import { GroupingItemList } from "./GroupingItemList"
import useGroupingItemDnd from "./useGroupingItemDnd"
import DropIndicator from "./DropIndicator"

// item in this context refers to a cloud group or local directory
// id in xItem methods refers to cloud group id or local directory path
// TODO: remove type duplication with GroupingItemList
export const GroupingItemTreeItemComponent: React.FC<{
  depth?: number
  index: number
  view: SidebarView<"primary">
  parentItemId: string | null
  itemId: string
  itemName: string
  childItems: ItemsBranch[]
  isEmpty: boolean
  isActive: boolean
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
  createItem: (values: { name?: string; parentItemId?: string | null }) => void
  deleteItem: () => void
  selectItem: () => void
  renameItem: (newName: string) => void
  moveItem: (
    itemId: string,
    destinationId: string,
    destinationIndex: number
  ) => void
  createDocument: () => void

  revealItem?: () => void
  removePath?: () => void
}> = memo(
  ({
    depth,
    index,
    view,
    parentItemId,
    itemId,
    itemName,
    childItems,
    isEmpty,
    isActive,
    isExpanded,
    setIsExpanded,
    renameItem,
    createDocument,
    createItem,
    deleteItem,
    selectItem,
    moveItem,
    revealItem,
    removePath,
  }) => {
    const { openMenu, closeMenu, ContextMenu } = useContextMenu()

    const [isCreatingGroup, setIsCreatingGroup] = useState(false)

    const icon = isExpanded
      ? "folderOpen"
      : isEmpty
      ? "folderEmpty"
      : "folderClosed"

    const { drag, drop, droppableRef, hoverState, isDragging, isOverCurrent } =
      useGroupingItemDnd({
        childItems,
        index,
        itemId,
        moveItem,
        parentItemId,
      })

    const { startRenaming, getProps, isRenaming } = useEditableText(
      itemName,
      renameItem
    )

    const handleCreateItem = useCallback(() => {
      setIsCreatingGroup(true)
      setIsExpanded(true)
    }, [setIsExpanded])

    const handleDeleteItem = useCallback(() => {
      deleteItem()
    }, [deleteItem])

    const handleRenameItem = useCallback(() => {
      closeMenu()
      startRenaming()
    }, [closeMenu, startRenaming])

    const handleCreateDocument = useCallback(() => {
      createDocument()
    }, [createDocument])

    const handleSelectItem = useCallback(() => {
      selectItem()
    }, [selectItem])

    const handleReveal = useCallback(() => {
      revealItem && revealItem()
    }, [revealItem])

    const handleRemovePath = useCallback(() => {
      removePath && removePath()
    }, [removePath])

    return (
      <>
        <div style={{ position: "relative" }}>
          <div ref={droppableRef}>
            <div ref={drop}>
              <div
                ref={drag}
                style={{
                  opacity: isDragging ? "0.2" : "1",
                }}
              >
                <GenericTreeItem
                  key={itemId}
                  depth={depth}
                  isExpanded={isExpanded}
                  isActive={isActive}
                  icon={icon}
                  title={{ cloud: itemName, local: itemId }[view]}
                  onContextMenu={openMenu}
                  onClick={handleSelectItem}
                  setIsExpanded={setIsExpanded}
                  nested={(depth) => (
                    <GroupingItemList
                      view={view}
                      parentItemId={itemId}
                      childItems={childItems}
                      depth={depth}
                      isCreatingGroup={isCreatingGroup}
                      setIsCreatingGroup={setIsCreatingGroup}
                      createItem={createItem}
                    />
                  )}
                >
                  <EditableText {...getProps()}>{itemName}</EditableText>
                  {!isRenaming && <GenericAddButton onAdd={handleCreateItem} />}
                </GenericTreeItem>
              </div>
            </div>
          </div>

          <DropIndicator
            state={hoverState}
            visible={hoverState !== HoverState.outside && isOverCurrent}
          />
        </div>

        <ContextMenu>
          {view === "cloud" ? (
            <>
              <ContextSubmenu text="Create New">
                <ContextMenuItem onClick={handleCreateDocument}>
                  Document
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCreateItem}>
                  Collection
                </ContextMenuItem>
              </ContextSubmenu>

              <ContextMenuSeparator />

              <ContextMenuItem onClick={handleRenameItem}>
                Rename
              </ContextMenuItem>
              {/* TODO: add confirmation dialog (emphasise the fact that this action can't be reversed) */}
              <ContextMenuItem onClick={handleDeleteItem}>
                Delete
              </ContextMenuItem>
            </>
          ) : view === "local" ? (
            <>
              <ContextSubmenu text="Create New">
                <ContextMenuItem onClick={handleCreateDocument}>
                  File
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCreateItem}>
                  Folder
                </ContextMenuItem>
              </ContextSubmenu>

              <ContextMenuSeparator />

              <ContextMenuItem onClick={handleReveal}>
                Reveal in Explorer
              </ContextMenuItem>
              <ContextMenuItem onClick={handleRenameItem}>
                Rename
              </ContextMenuItem>

              {/* TODO: use a less error-prone solution than a depth check */}
              {depth === 1 ? (
                <ContextSubmenu text="Delete">
                  <ContextMenuItem onClick={handleRemovePath}>
                    From Library
                  </ContextMenuItem>
                  <ContextMenuItem onClick={handleDeleteItem}>
                    From Disk
                  </ContextMenuItem>
                </ContextSubmenu>
              ) : (
                <ContextMenuItem onClick={handleDeleteItem}>
                  Delete From Disk
                </ContextMenuItem>
              )}
              {/* TODO: add confirmation dialog (emphasise the fact that this action can't be reversed) */}
            </>
          ) : null}
        </ContextMenu>
      </>
    )
  }
)
