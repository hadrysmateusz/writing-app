import { Toggleable } from "../../hooks"

export type SwitchViewFn = (view: PrimarySidebarViews) => void

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

export enum CloudViews {
  ALL = "cloud_all",
  TRASH = "cloud_trash",
  INBOX = "cloud_inbox",
  GROUP = "cloud_group",
}

export enum LocalViews {
  ALL = "local_all",
}

export enum SnippetsViews {
  ALL = "snippets_all",
  GLOBAL = "snippets_global",
  CURRENT_DOC = "snippets_currentDoc",
  // GROUP = "snippets_group",
}

export enum PrimarySidebarViews {
  cloud = "cloud",
  local = "local",
  snippets = "snippts",
}

export type PrimarySidebarSubviewsFlat = CloudViews | LocalViews | SnippetsViews

export type PrimarySidebarSubviews = {
  cloud: CloudViews
  local: LocalViews
  snippets: SnippetsViews | string
}

export interface MultiViewSidebar extends SidebarBase {
  currentView: string
  switchView: SwitchViewFn
}

export interface SingleViewSidebar extends SidebarBase {}

export interface NavigatorSidebar extends SingleViewSidebar {}

export interface PrimarySidebar extends MultiViewSidebar {
  currentSubviews: { cloud: string; local: string; snippets: string }
  switchSubview: (view: string, subview: string) => void
}

export interface SecondarySidebar extends MultiViewSidebar {}

export type Sidebar = NavigatorSidebar | PrimarySidebar | SecondarySidebar

export type ViewState = {
  navigatorSidebar: NavigatorSidebar
  primarySidebar: PrimarySidebar
  secondarySidebar: SecondarySidebar
}
