import React, { useMemo, useCallback, useState, useRef } from "react"
import styled, { css } from "styled-components/macro"
import { throttle } from "lodash"
import {
  DragObjectWithType,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd"

import { StatelessExpandableTreeItem, AddButton } from "../TreeItem"
import {
  useContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../ContextMenu"
import { useViewState } from "../View/ViewStateProvider"
import { useEditableText, EditableText } from "../RenamingInput"
import { useDocumentsAPI, useGroupsAPI } from "../MainProvider"
import { GroupsList } from "../GroupsList"
import {
  HoverState,
  GroupHoverItem,
  GroupDropResult,
  GroupDragCollectedProps,
} from "./types"

import { formatOptional } from "../../utils"
import { DND_TYPES } from "../../constants"
import { GroupTreeBranch } from "../../helpers/createGroupTree"
import { useLocalSettings } from "../LocalSettings"
import { LocalSettings } from "../Database"

// ============== DRAG'N'DROP IMPROVEMENTS ===============
// TODO: when dropping in the same place (on the same item), don't show the hover indicator
// TODO: make it clear when a drop will be dropped at a different depth
// TODO: make it possible to drop on the "Add Collection" button and the section header to drop as the last and first item respectively

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  index: number
  depth?: number
}> = ({ group, depth, index }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { createDocument } = useDocumentsAPI()
  const { renameGroup, removeGroup, moveGroup } = useGroupsAPI()
  const { primarySidebar } = useViewState()
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [hoverState, setHoverState] = useState<HoverState>(HoverState.outside)
  const droppableRef = useRef<HTMLDivElement>(null)
  const { expandedKeys, updateLocalSetting } = useLocalSettings()

  const isExpanded = useMemo(() => {
    return expandedKeys.includes(group.id)
  }, [expandedKeys, group.id])

  const setIsExpanded = useCallback(
    (value: boolean) => {
      let newExpandedKeys: LocalSettings["expandedKeys"]

      if (value === true) {
        // This check is to ensure that there are no duplicated keys
        if (isExpanded) {
          newExpandedKeys = expandedKeys
        } else {
          newExpandedKeys = [...expandedKeys, group.id]
        }
      } else {
        newExpandedKeys = expandedKeys.filter((id) => id !== group.id)
      }

      updateLocalSetting("expandedKeys", newExpandedKeys)
    },
    [expandedKeys, group.id, isExpanded, updateLocalSetting]
  )

  const isEmpty = useMemo(() => {
    return group.children.length === 0
  }, [group.children.length])

  const { startRenaming, getProps, isRenaming } = useEditableText(
    formatOptional(group.name, ""),
    (value: string) => {
      renameGroup(group.id, value)
    }
  )

  const handleRenameDocument = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const handleNewGroup = useCallback(() => {
    setIsCreatingGroup(true)
    setIsExpanded(true)
  }, [setIsExpanded])

  const handleNewDocument = useCallback(() => {
    createDocument(group.id)
  }, [createDocument, group.id])

  const handleDeleteGroup = useCallback(() => {
    removeGroup(group.id)
  }, [group.id, removeGroup])

  const handleClick = useCallback(() => {
    primarySidebar.switchView(group.id)
  }, [group.id, primarySidebar])

  const groupName = useMemo(
    () => formatOptional(group.name, "Unnamed Collection"),
    [group.name]
  )

  const isActive = primarySidebar.currentView === group.id
  const icon = isExpanded
    ? "folderOpen"
    : isEmpty
    ? "folderEmpty"
    : "folderClosed"

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
    item: { type: DND_TYPES.GROUP, id: group.id, parentId: group.parentGroup },
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

      await moveGroup(item.id, destinationIndex, destinationId)
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
            destinationId: group.parentGroup,
            destinationIndex: index - 1,
          }
        case HoverState.below:
          return {
            destinationId: group.parentGroup,
            destinationIndex: index,
          }
        case HoverState.inside:
          return {
            destinationId: group.id,
            destinationIndex: Math.min(group.children.length - 1, 0),
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
              <StatelessExpandableTreeItem
                key={group.id}
                depth={depth}
                onContextMenu={openMenu}
                onClick={handleClick}
                isExpanded={isExpanded}
                isActive={isActive}
                setIsExpanded={setIsExpanded}
                icon={icon}
                nested={(depth) => (
                  <GroupsList
                    depth={depth}
                    group={group}
                    isCreatingGroup={isCreatingGroup}
                    setIsCreatingGroup={setIsCreatingGroup}
                  />
                )}
              >
                <EditableText {...getProps()}>{groupName}</EditableText>
                {!isRenaming && <AddButton groupId={group.id} />}
              </StatelessExpandableTreeItem>
            </div>
          </div>
        </div>

        <DropIndicator
          state={hoverState}
          visible={hoverState !== HoverState.outside && isOverCurrent}
        />
      </div>

      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewGroup}>
            New Collection
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={handleRenameDocument}>
            Rename
          </ContextMenuItem>
          {/* TODO: add danger style option to ContextMenuItem */}
          <ContextMenuItem onClick={handleDeleteGroup}>Delete</ContextMenuItem>
        </ContextMenu>
      )}
    </>
  )
}

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

export default GroupTreeItem
