import { ADJUST_OFFSET_MARGIN } from "../constants"
import { Coords } from "../types"

import { getElementMeasurements } from "./misc"

/**
 * A specific helper used for adjusting a context menu's horizontal position to prevent overflow.
 *
 * @param referenceX Reference X coordinate representing the menu's current left edge position.
 * @param menuRightEdge Current X coordinate of the menu's right edge, used for comparison against the window width.
 *
 * @returns Adjusted X coordinate that fits inside the window.
 */
export const adjustMenuHorizontally = (
  referenceX: number,
  menuRightEdge: number
) => {
  const windowWidth = window.innerWidth

  if (menuRightEdge > windowWidth) {
    // ADJUST_OFFSET_MARGIN used to provide some padding against window edges
    const overflowOffset = menuRightEdge - windowWidth
    const adjustedX = referenceX - overflowOffset + ADJUST_OFFSET_MARGIN
    return adjustedX
  } else {
    return referenceX
  }
}

/**
 * A specific helper used for adjusting a context menu's vertical position to prevent overflow.
 *
 * @param referenceY Reference Y coordinate representing the menu's current top edge position.
 * @param menuBottomEdge Current Y coordinate of the menu's bottom edge, used for comparison against the window height.
 *
 * @returns Adjusted Y coordinate that fits inside the window.
 */
export const adjustMenuVertically = (
  referenceY: number,
  menuBottomEdge: number
) => {
  const windowHeight = window.innerHeight

  if (menuBottomEdge > windowHeight) {
    // ADJUST_OFFSET_MARGIN used to provide some padding against window edges
    const overflowOffset = menuBottomEdge - windowHeight
    const adjustedY = referenceY - overflowOffset + ADJUST_OFFSET_MARGIN
    return adjustedY
  } else {
    return referenceY
  }
}

/**
 * Specific helper for adjusting a context menu to prevent it from overflowing window.
 *
 * @param menuEl Menu element's DOM node.
 * @param referenceCoords Menu's starting coordinates to be adjusted in case of overflow.
 *
 * @returns A new set of adjusted coordinates that fit inside the window.
 */
export const adjustMenuCoords = (
  menuEl: HTMLElement,
  referenceCoords: Coords
): Coords => {
  const refX = referenceCoords[0]
  const refY = referenceCoords[1]

  const { rightEdge: menuRightEdge, bottomEdge: menuBottomEdge } =
    getElementMeasurements(menuEl, referenceCoords)

  const newX: number = adjustMenuHorizontally(refX, menuRightEdge)
  const newY: number = adjustMenuVertically(refY, menuBottomEdge)
  const newCoords: Coords = [newX, newY]

  return newCoords
}
