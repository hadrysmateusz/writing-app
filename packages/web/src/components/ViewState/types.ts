import { Toggleable } from "../../hooks"
import { LocalSettings } from "../Database/types"

// TODO: the way this function works is probably why opening directories with underscores in the name don't work. Either rework the system or use a separator that is not supported in paths on any OS (that might be hard as it seems that MacOS supports all of unicode)
// TODO: move this to a more logical place
export function parseSidebarPath(path: string) {
  const pathParts = path.split("_")
  // console.log(pathParts)

  const sidebar = Object.keys(SIDEBAR_VAR).find((s) => s === pathParts[0])
  if (!sidebar) return null
  // console.log(sidebar)

  const view = Object.keys(SIDEBAR_VAR[sidebar]).find((s) => s === pathParts[1])
  if (!view) return null
  // console.log(view)

  const subview = Object.keys(SIDEBAR_VAR[sidebar][view]).find(
    (s) => s === pathParts[2]
  )
  if (!subview) return null
  // console.log(subview)

  // console.log(SIDEBAR_VAR[sidebar][view][subview], path)

  return { sidebar, view, subview, id: pathParts[3] as string | undefined }

  // TODO: figure out how to make this check work with the last part being the id
  // if (SIDEBAR_VAR[sidebar][view][subview] === path) {
  //   return { sidebar, view, subview, id: pathParts[3] }
  // }
  // return null
}

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
      directory: "primary_local_all" as "primary_local_all",
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

// console.log(parseSidebarPath("navigator_default_all"))
// console.log(parseSidebarPath("primary_cloud_all"))
// console.log(parseSidebarPath("primary_cloud_trash"))
// console.log(parseSidebarPath("primary_cloud_inbox"))
// console.log(parseSidebarPath("primary_cloud_group"))
// console.log(parseSidebarPath("primary_local_all"))
// console.log(parseSidebarPath("primary_tags_all"))
// console.log(parseSidebarPath("secondary_stats_all"))

export type SidebarType = typeof SIDEBAR_VAR
export type SidebarSidebar = keyof SidebarType
export type SidebarView<S extends SidebarSidebar> = keyof SidebarType[S]
export type SidebarSubview<
  S extends SidebarSidebar,
  V extends SidebarView<S>
> = keyof SidebarType[S][V]
export type SidebarPath<
  S extends SidebarSidebar,
  V extends SidebarView<S>,
  SV extends SidebarSubview<S, V>
> = SidebarType[S][V][SV]

export type SidebarPaths<S extends SidebarSidebar> = Record<
  SidebarView<S>,
  string // TODO: consider using a template literal type like `${sidebar}_${view}_${subview}_${string}`
>

export enum Side {
  left = "left",
  right = "right",
}

// TODO: change usages with SidebarSidebar
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

// TODO: make all sidebars multiview to simplify and unify the methods and components working with them

export interface MultiViewSidebar<S extends SidebarSidebar>
  extends SidebarBase {
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
  currentSubviews: SidebarPaths<"primary">
  switchSubview: SwitchPrimarySidebarViewFn
}

export interface SecondarySidebar extends MultiViewSidebar<"secondary"> {}

export type Sidebar = NavigatorSidebar | PrimarySidebar | SecondarySidebar
