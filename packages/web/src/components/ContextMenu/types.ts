import { Toggleable } from "../../hooks"

export type Coords = [number, number]

export type ContextMenuProps = {
  eventCoords: Coords
  close: Toggleable<undefined>["close"]
  isOpen: boolean

  closeAfterClick?: boolean
  closeOnScroll?: boolean
}
