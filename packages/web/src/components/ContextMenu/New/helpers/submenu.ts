import { BORDER_WIDTH } from "../constants"
import { Coords } from "../types"
import { adjustMenuVertically } from "./menu"
import { getElementMeasurements } from "./misc"

/**
 * A specific helper used for adjusting a context submenu's horizontal position to prevent overflow.
 *
 * @param referenceX Reference X coordinate representing the parent menu's right edge.
 * @param submenuRightEdge Current X coordinate of the submenut's right edge, used for comparison against the window width.
 * @param submenuWidth Width of the submenu used as offset in case it needs to be moved to the left side of its parent menu.
 * @param parentMenuLeftEdge Position of the parent menu's left edge used as base for calculations  in case the submenu needs to be moved to the left side of the parent menu.
 *
 * @returns Adjusted X coordinate that fits inside the window.
 */
export const adjustSubmenuHorizontally = (
  referenceX: number,
  submenuRightEdge: number,
  submenuWidth: number,
  parentMenuLeftEdge: number
) => {
  const windowWidth = window.innerWidth

  // BORDER_WIDTH used to nudge in order to prevent single-pixel gaps closing submenu on slower mouse movements
  if (submenuRightEdge > windowWidth) {
    return parentMenuLeftEdge - submenuWidth + BORDER_WIDTH
  } else {
    return referenceX - BORDER_WIDTH
  }
}

/**
 * See adjustMenuVertically.
 *
 * Currently just an alias of adjustMenuVertically as they both have the same requirements.
 */
export const adjustSubmenuVertically = adjustMenuVertically

/**
 * Specific helper for adjusting a context submenu to prevent it from overflowing window.
 *
 * @param menuEl Menu element's DOM node.
 * @param parentMenuItemEl DOM node of the context menu item that triggered this submenu.
 * @param parentMenuEl DOM node of the closest parent menu.
 *
 * @returns A new set of adjusted coordinates that fit inside the window.
 */
export const adjustSubmenuCoords = (
  menuEl,
  parentMenuItemEl,
  parentMenuEl
): Coords => {
  // TODO: I could probably remove the dependance on this entirely and use menuItem measurements exclusively (which would also remove necessity for context)

  // get parent menu measurements
  const { leftEdge: parentMenuLeftEdge, rightEdge: parentMenuRightEdge } =
    getElementMeasurements(parentMenuEl)

  // get menu item measurements
  const { topEdge: menuItemTopEdge } = getElementMeasurements(parentMenuItemEl)

  // reference position (intented position if no adjustments are needed)
  const refX = parentMenuRightEdge
  const refY = menuItemTopEdge
  const referenceCoords: Coords = [refX, refY]

  // get submenu measurements
  const {
    rightEdge: menuRightEdge,
    bottomEdge: menuBottomEdge,
    width: menuWidth,
  } = getElementMeasurements(menuEl, referenceCoords)

  const newX = adjustSubmenuHorizontally(
    refX,
    menuRightEdge,
    menuWidth,
    parentMenuLeftEdge
  )
  const newY = adjustMenuVertically(refY, menuBottomEdge)
  const newCoords: Coords = [newX, newY]

  return newCoords
}
