import { Toggleable } from "../../hooks"

export type SwitchViewFn = (view: string | null) => void

export enum Side {
  left = "left",
  right = "right",
}

export enum SidebarID {
  primary = "primarySidebar",
  secondary = "secondarySidebar",
  navigator = "navigatorSidebar",
}

export interface SidebarBase extends Toggleable {
  id: SidebarID
  side: Side
  maxWidth: number
  minWidth: number
}

export interface MultiViewSidebar extends SidebarBase {
  currentView: string
  switchView: SwitchViewFn
}

export interface SingleViewSidebar extends SidebarBase {}

export type Sidebar = MultiViewSidebar | SingleViewSidebar

export type ViewState = {
  primarySidebar: MultiViewSidebar
  secondarySidebar: MultiViewSidebar
  navigatorSidebar: SingleViewSidebar
}
