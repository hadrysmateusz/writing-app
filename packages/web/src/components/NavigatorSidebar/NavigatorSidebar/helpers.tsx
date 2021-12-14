import { useCallback } from "react"
import {
  parseSidebarPath,
  SidebarSubview,
  SidebarView,
  usePrimarySidebar,
} from "../../ViewState"

export function useNavigationTreeItem<V extends SidebarView<"primary">>(
  view: V,
  subview: SidebarSubview<"primary", V>
) {
  const { currentView, currentSubviews, switchSubview } = usePrimarySidebar()

  const currentSubview = parseSidebarPath(currentSubviews[currentView])?.subview

  const getTreeItemProps = useCallback(
    () => ({
      isActive: currentView === view && currentSubview === subview,
      onClick: () => switchSubview<V>(view, subview),
    }),
    [currentSubview, currentView, subview, switchSubview, view]
  )

  return getTreeItemProps
}

// ================== W.I.P. version supporting all sidebars (requires all sidebars to support all of the properties)
// export function useNavigationTreeItem<
//   S extends SidebarSidebar,
//   V extends SidebarView<S>
// >(sidebar: S, view: SidebarView<S>, subview: SidebarSubview<S, V>) {
//   const {
//     primarySidebar: primary,
//     secondarySidebar: secondary,
//     navigatorSidebar: navigator,
//   } = useViewState()
//   const { currentView, currentSubviews, switchSubview } = {primary,secondary,navigator}[sidebar]

//   const {}

//   const getTreeItemProps = () => ({
//     isActive: currentSubviews[currentView] === subview,
//     onClick: () => switchSubview("cloud", subview),
//   })

//   return getTreeItemProps
// }
