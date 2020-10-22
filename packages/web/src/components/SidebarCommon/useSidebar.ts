import { useCallback, useEffect, useState, useRef } from "react"

import { SidebarID, Side, Sidebar } from "../ViewState"
import { clamp } from "../../utils"

// TODO: replace local storage with something more performant - e.g. a local preferences rxdb database (not sure if that's better though)
const getDefaultSize = (key: string, fallback: number): number => {
  return parseInt(localStorage.getItem(key) || fallback.toString(), 10)
}
const setDefaultSize = (key: string, size: number): void => {
  localStorage.setItem(key, size.toString())
}

const useSplitPane = (storageKey: string) => {
  const [size, setSize] = useState<number>(() =>
    getDefaultSize(storageKey, 200)
  )
  // TODO: debounce
  const handleChange = useCallback(
    (s) => {
      setSize(s)
      setDefaultSize(storageKey, s)
    },
    [storageKey]
  )

  return { defaultSize: size, handleChange }
}

const sidebarWidthStorageKeys = {
  [SidebarID.navigator]: "splitPos_navigatorSidebar",
  [SidebarID.primary]: "splitPos_primarySidebar",
  [SidebarID.secondary]: "splitPos_secondarySidebar",
}

export const useSidebar = (sidebar: Sidebar) => {
  const { id, isOpen, minWidth, maxWidth, side, close } = sidebar
  const widthStorageKey = sidebarWidthStorageKeys[id]

  const { defaultSize, handleChange } = useSplitPane(widthStorageKey)

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(defaultSize)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isDragging) return
    if (isOpen && sidebarWidth === 0) {
      console.log("resetting")
      setSidebarWidth(Math.max(minWidth, defaultSize))
    }
  }, [defaultSize, isDragging, minWidth, isOpen, sidebarWidth])

  useEffect(() => {
    if (isDragging) return
    if (!isOpen) {
      setSidebarWidth(0)
    }
  }, [isDragging, isOpen])

  const handleDragStart = useCallback(() => {
    if (!isOpen) return
    setIsDragging(true)
  }, [isOpen])

  const handleDrag = useCallback(
    (_direction, _track, style) => {
      if (!isDragging) return

      const widthWithUnit = style.split(" ")[side === Side.right ? 2 : 0]
      const width = widthWithUnit.slice(0, -2)

      setSidebarWidth(Math.min(maxWidth, width))
      handleChange(width)
    },
    [handleChange, isDragging, maxWidth, side]
  )

  const handleDragEnd = useCallback(() => {
    const newSidebarWidth = sidebarRef?.current?.getBoundingClientRect().width

    if (newSidebarWidth === 0) {
      close()
    }

    if (newSidebarWidth !== undefined) {
      setSidebarWidth(Math.min(maxWidth, newSidebarWidth))
    }

    setIsDragging(false)
  }, [close, maxWidth])

  const clampedSidebarWidth = clamp(minWidth, sidebarWidth, maxWidth)
  const gridTemplateColumns =
    sidebar.side === Side.right
      ? `1fr auto ${clampedSidebarWidth}px`
      : `${clampedSidebarWidth}px auto 1fr`

  const getSplitProps = useCallback(
    () => ({
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      snapOffset: 0,
      direction: "horizontal",
      cursor: "col-resize",
      gridTemplateColumns,
    }),
    [gridTemplateColumns, handleDrag, handleDragEnd, handleDragStart]
  )

  return {
    ref: sidebarRef,
    width: clampedSidebarWidth,
    getSplitProps,
  }
}
