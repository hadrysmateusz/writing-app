import { useViewState, SidebarSubview, SidebarView } from "../../ViewState"

// TODO: currently only works for cloud view subviews but I should work on a way to infer view from subview
export function useNavigationTreeItem<V extends SidebarView<"primary">>(
  view: V,
  subview: SidebarSubview<"primary", V>
) {
  const { primarySidebar } = useViewState()
  const { currentView, currentSubviews, switchSubview } = primarySidebar

  const getTreeItemProps = () => ({
    isActive: currentSubviews[currentView] === subview,
    onClick: () => switchSubview<V>(view, subview),
  })

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
