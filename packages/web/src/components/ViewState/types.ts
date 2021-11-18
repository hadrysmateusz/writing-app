import React from "@udecode/plate-dnd/node_modules/@types/react"
import { Toggleable } from "../../hooks"
import { LocalSettings } from "../Database/types"

export enum Side {
  left = "left",
  right = "right",
}

export enum SidebarID {
  primary = "primarySidebar",
  secondary = "secondarySidebar",
  navigator = "navigatorSidebar",
}

export interface SidebarBase extends Toggleable<undefined> {
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

export enum TagsViews {
  ALL = "tags_all",
}

export enum SecondarySidebarViews {
  stats = "stats",
}

export enum PrimarySidebarViews {
  cloud = "cloud",
  local = "local",
  snippets = "snippets",
  tags = "tags",
}

export type PrimarySidebarSubviewsFlat = CloudViews | LocalViews | SnippetsViews

export type PrimarySidebarSubviews = {
  cloud: CloudViews
  local: LocalViews
  snippets: SnippetsViews | string
  tags: TagsViews
}

export type PrimarySidebarSubview<
  Subview extends keyof PrimarySidebarSubviews
> = PrimarySidebarSubviews[Subview]

export interface MultiViewSidebar<
  Views = PrimarySidebarViews | SecondarySidebarViews
> extends SidebarBase {
  currentView: string
  switchView: (view: Views) => void
}

export interface SingleViewSidebar extends SidebarBase {}

export interface NavigatorSidebar extends SingleViewSidebar {
  expandedKeys: LocalSettings["expandedKeys"]
  setExpandedKeys: React.Dispatch<
    React.SetStateAction<LocalSettings["expandedKeys"]>
  >
}

export interface PrimarySidebar extends MultiViewSidebar<PrimarySidebarViews> {
  // TODO: investigate why this doesn't simply use the PriomarySidebarSubviews enum
  currentSubviews: {
    cloud: string
    local: string
    snippets: string
    tags: TagsViews
  }
  switchSubview: (view: PrimarySidebarViews, subview: string) => void
}

export interface SecondarySidebar
  extends MultiViewSidebar<SecondarySidebarViews> {}

export type Sidebar = NavigatorSidebar | PrimarySidebar | SecondarySidebar

export type ViewState = {
  navigatorSidebar: NavigatorSidebar
  primarySidebar: PrimarySidebar
  secondarySidebar: SecondarySidebar
}
