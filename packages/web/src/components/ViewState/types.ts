import { Toggleable } from "../../hooks"

import { LocalSettings } from "../Database"

export const SIDEBAR_VAR = Object.freeze({
  navigator: {
    default: {
      all: "navigator_default_all" as "navigator_default_all",
    },
  },
  primary: {
    cloud: {
      all: "primary_cloud_all" as "primary_cloud_all",
      trash: "primary_cloud_trash" as "primary_cloud_trash",
      inbox: "primary_cloud_inbox" as "primary_cloud_inbox",
      group: "primary_cloud_group" as "primary_cloud_group",
      tag: "primary_cloud_tag" as "primary_cloud_tag",
    },
    local: {
      all: "primary_local_all" as "primary_local_all",
      directory: "primary_local_directory" as "primary_local_directory",
    },
    tags: {
      all: "primary_tags_all" as "primary_tags_all",
    },
  },
  secondary: {
    stats: {
      all: "secondary_stats_all" as "secondary_stats_all",
    },
  },
})

export type SidebarType = typeof SIDEBAR_VAR
export type SidebarID = keyof SidebarType
export type SidebarView<S extends SidebarID> = keyof SidebarType[S]
export type SidebarSubview<
  S extends SidebarID,
  V extends SidebarView<S>
> = keyof SidebarType[S][V]
export type SidebarPath<
  S extends SidebarID,
  V extends SidebarView<S>,
  SV extends SidebarSubview<S, V>
> = SidebarType[S][V][SV]

export type SidebarPaths<S extends SidebarID> = Record<
  SidebarView<S>,
  string // TODO: consider using a template literal type like `${sidebar}_${view}_${subview}_${string}`
>

export enum Side {
  left = "left",
  right = "right",
}

export interface SidebarBase extends Toggleable<undefined> {
  id: SidebarID
  side: Side
  maxWidth: number
  minWidth: number
}

// TODO: make all sidebars multiview to simplify and unify the methods and components working with them

export interface MultiViewSidebar<S extends SidebarID> extends SidebarBase {
  currentView: SidebarView<S>
  switchView: (view: SidebarView<S>) => Promise<void>
}

export interface SingleViewSidebar extends SidebarBase {}

export interface NavigatorSidebar extends SingleViewSidebar {
  expandedKeys: LocalSettings["expandedKeys"]
  setExpandedKeys: React.Dispatch<
    React.SetStateAction<LocalSettings["expandedKeys"]>
  >
}

export type SwitchPrimarySidebarViewFn = <View extends SidebarView<"primary">>(
  view: View,
  subview: SidebarSubview<"primary", View>,
  id?: string // optional id used for some paths like groups
) => Promise<void>

export interface PrimarySidebar extends MultiViewSidebar<"primary"> {
  documentsListDisplayType: LocalSettings["documentsListDisplayType"]
  currentSubviews: SidebarPaths<"primary">
  collapsedIdentifiers: string[]
  toggleSection: (identifier: string, value?: boolean) => void
  switchDocumentsListDisplayType: (
    value: LocalSettings["documentsListDisplayType"]
  ) => void
  switchSubview: SwitchPrimarySidebarViewFn
}

export interface SecondarySidebar extends MultiViewSidebar<"secondary"> {}

export type Sidebar = NavigatorSidebar | PrimarySidebar | SecondarySidebar
