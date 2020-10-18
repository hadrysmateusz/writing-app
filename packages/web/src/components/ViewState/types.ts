import { Toggleable } from "../../hooks"

export type SwitchViewFn = (view: string | null) => void

export type Sidebar = Toggleable & {
  id: "primarySidebar" | "secondarySidebar" | "navigatorSidebar"
}

export type MultiViewSidebar = Sidebar & {
  currentView: string
  switchView: SwitchViewFn
}

export type SingleViewSidebar = Sidebar & {}

export type ViewState = {
  primarySidebar: MultiViewSidebar
  secondarySidebar: MultiViewSidebar
  navigatorSidebar: SingleViewSidebar
}
