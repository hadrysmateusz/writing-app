import { useViewState, PrimarySidebarViews, CloudViews } from "../../ViewState"

// TODO: currently only works for cloud view subviews but I should work on a way to infer view from subview
export function useNavigationTreeItem(subview: CloudViews) {
  const { primarySidebar } = useViewState()
  const { currentView, currentSubviews, switchSubview } = primarySidebar

  const getTreeItemProps = () => ({
    isActive: currentSubviews[currentView] === subview,
    onClick: () => switchSubview(PrimarySidebarViews.cloud, subview),
  })

  return getTreeItemProps
}
