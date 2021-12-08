import { useMemo, useState, useRef } from "react"
import { throttle } from "lodash"
import {
  DragObjectWithType,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd"

import { DND_TYPES } from "../../constants"

import {
  HoverState,
  GroupHoverItem,
  GroupDropResult,
  GroupDragCollectedProps,
  ItemsBranch,
} from "./types"

// ============== DRAG'N'DROP IMPROVEMENTS ===============
// TODO: when dropping in the same place (on the same item), don't show the hover indicator
// TODO: make it clear when a drop will be dropped at a different depth
// TODO: make it possible to drop on the "Add Collection" button and the section header to drop as the last and first item respectively

export const useGroupingItemDnd = ({
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

export default useGroupingItemDnd
