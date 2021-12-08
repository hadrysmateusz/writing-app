import React, { useMemo, useCallback, useState, useRef, memo } from "react"
import styled, { css } from "styled-components/macro"
import { throttle } from "lodash"
import {
  DragObjectWithType,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd"

import { DND_TYPES } from "../../constants"

import { GenericTreeItem, GenericAddButton } from "../TreeItem"
import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextSubmenu,
} from "../ContextMenu"
import { useEditableText, EditableText } from "../RenamingInput"

import {
  HoverState,
  GroupHoverItem,
  GroupDropResult,
  GroupDragCollectedProps,
} from "./types"
import { GroupingItemList, ItemsBranch } from "./GroupsList"
import { SidebarView } from "../ViewState"

// ============== DRAG'N'DROP IMPROVEMENTS ===============
// TODO: when dropping in the same place (on the same item), don't show the hover indicator
// TODO: make it clear when a drop will be dropped at a different depth
// TODO: make it possible to drop on the "Add Collection" button and the section header to drop as the last and first item respectively

const useGroupingItemDnd = ({
  itemId,
  parentItemId,
  index,
  childItems,
  moveItem,
}: {
  itemId: string
  parentItemId: string | null
  index: number
  childItems: ItemsBranch[]
  moveItem: (
    itemId: string,
    destinationId: string,
    destinationIndex: number
  ) => void
}) => {
  const droppableRef = useRef<HTMLDivElement | null>(null)
  const [hoverState, setHoverState] = useState<HoverState>(HoverState.outside)

  const getHoverState = (
    target: DOMRect | undefined,
    monitor: DropTargetMonitor
  ) => {
    if (!monitor.isOver()) {
      return HoverState.outside
    }

    const pointer = monitor.getClientOffset()

    if (target && pointer) {
      const offset = 8

      const position = pointer.y

      const top = target.y
      const topInner = top + offset
      const bottom = target.y + target.height
      const bottomInner = bottom - offset

      if (position >= top && position <= topInner) {
        return HoverState.above
      } else if (position <= bottom && position >= bottomInner) {
        return HoverState.below
      } else if (position >= topInner && position <= bottomInner) {
        return HoverState.inside
      }
    }

    return HoverState.outside
  }

  const [{ isDragging }, drag] = useDrag<
    GroupHoverItem,
    GroupDropResult,
    GroupDragCollectedProps
  >({
    item: { type: DND_TYPES.GROUP, id: itemId, parentId: parentItemId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: async (item, monitor) => {
      const results = monitor.getDropResult()

      if (!results) {
        console.info("no results, drag was probably cancelled")
        return
      }

      const { destinationId, destinationIndex } = results

      if (!item) {
        console.info("no item")
        return
      }

      console.info(`should move group ${item.id}
from group ${item.parentId} (index ${index})
to group ${destinationId} (index ${destinationIndex})`)

      await moveItem(item.id, destinationId, destinationIndex)
    },
  })

  const onHover = useMemo(() => {
    return throttle((_item: DragObjectWithType, monitor: DropTargetMonitor) => {
      const target = droppableRef.current?.getBoundingClientRect()
      const newHoverState = getHoverState(target, monitor)
      setHoverState(newHoverState)
    }, 20)
  }, [])

  const [{ isOverCurrent }, drop] = useDrop({
    accept: DND_TYPES.GROUP,
    drop: (_item: GroupHoverItem, monitor): GroupDropResult | undefined => {
      if (monitor.didDrop()) return

      const target = droppableRef.current?.getBoundingClientRect()

      const hoverState = getHoverState(target, monitor)

      switch (hoverState) {
        case HoverState.above:
          return {
            destinationId: parentItemId,
            destinationIndex: index - 1,
          }
        case HoverState.below:
          return {
            destinationId: parentItemId,
            destinationIndex: index,
          }
        case HoverState.inside:
          return {
            destinationId: itemId,
            destinationIndex: Math.min(childItems.length - 1, 0),
          }
        default:
          return undefined
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      isOverCurrent: !!monitor.isOver({ shallow: true }),
    }),
    hover: onHover,
  })

  return {
    hoverState,
    droppableRef,
    drop,
    drag,
    isOverCurrent,
    isDragging,
  }
}

// item in this context refers to a cloud group or local directory
// id in xItem methods refers to cloud group id or local directory path
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
  createItem: (values: { name?: string }) => void
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

    const {
      drag,
      drop,
      droppableRef,
      hoverState,
      isDragging,
      isOverCurrent,
    } = useGroupingItemDnd({
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
                      itemId={itemId}
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

const DropIndicator = styled.div<{ state: HoverState; visible: boolean }>`
  left: 0;
  right: 0;
  position: absolute;
  user-select: none;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 200ms ease-out;
  opacity: ${(p) => (p.visible ? "1" : "0")};

  ${(p) => {
    if (p.state === HoverState.above) {
      return css`
        top: -2px;
        height: 4px;
        background: rgba(40, 147, 235, 0.5);
      `
    } else if (p.state === HoverState.below) {
      return css`
        bottom: -2px;
        height: 4px;
        background: rgba(40, 147, 235, 0.5);
      `
      // This condition is required to avoid visual issues with rendering the "inside" styles when state is "outside" but the visibility isn't reset yet
    } else if (p.state === HoverState.inside) {
      return css`
        top: 0;
        background: rgba(40, 147, 235, 0.25);
        height: 100%;
      `
    } else {
      return css`
        background: none;
      `
    }
  }};
`
