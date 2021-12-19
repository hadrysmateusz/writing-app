import { Coords } from "../types"

/**
 * Used to get size and edges of an item at its current or other position.
 *
 * @param element Element whose measurements are taken. Its X and Y coordinates will be used as default position if one isn't supplied.
 * @param position Can be used to supply a position different than the element's current one as the calculations' reference point.
 *
 * @returns A set of measurements including width, size, and position of all 4 edges. All values are rounded to closest integer.
 */
export const getElementMeasurements = (
  element: HTMLElement,
  position?: Coords
) => {
  const rect = element.getBoundingClientRect()

  const x = Math.round(position?.[0] || rect.x)
  const y = Math.round(position?.[1] || rect.y)

  const width = Math.round(rect.width)
  const height = Math.round(rect.height)

  const leftEdge = x
  const topEdge = y
  const rightEdge = x + width
  const bottomEdge = y + height

  return {
    width,
    height,

    leftEdge,
    topEdge,
    rightEdge,
    bottomEdge,
  }
}
