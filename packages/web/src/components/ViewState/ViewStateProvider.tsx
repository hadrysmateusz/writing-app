import { FC, Reducer, useReducer } from "react"
import { SidebarSidebar } from "."

import { withDelayRender } from "../../withDelayRender"

import { NavigatorSidebarProvider } from "./NavigatorSidebarContext"
import { PrimarySidebarProvider } from "./PrimarySidebarContext"
import { SecondarySidebarProvider } from "./SecondarySidebarContext"

export type SidebarsLoadingState = Record<SidebarSidebar, boolean>
export type SidebarsLoadingAction = {
  type: "sidebar-ready"
  sidebarId: SidebarSidebar
}
type SidebarsLoadingReducer = Reducer<
  SidebarsLoadingState,
  SidebarsLoadingAction
>

const reducer: SidebarsLoadingReducer = (state, action) => {
  switch (action.type) {
    case "sidebar-ready": {
      return { ...state, [action.sidebarId]: true }
    }
  }
}

const initialState: SidebarsLoadingState = {
  navigator: false,
  primary: false,
  secondary: false,
}

export const ViewStateProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer<SidebarsLoadingReducer>(
    reducer,
    initialState
  )

  const isReady = state.navigator && state.primary && state.secondary

  return (
    <NavigatorSidebarProvider loadingStateDispatch={dispatch}>
      <PrimarySidebarProvider loadingStateDispatch={dispatch}>
        <SecondarySidebarProvider loadingStateDispatch={dispatch}>
          {isReady ? children : <LoadingState />}
        </SecondarySidebarProvider>
      </PrimarySidebarProvider>
    </NavigatorSidebarProvider>
  )
}

const LoadingState: FC = withDelayRender(1000)(() => <div>Loading...</div>)

// enum SidebarSidebars {
//   "navigator" = "navigator",
//   "primary" = "primary",
//   "secondary" = "secondary",
// }
// enum SidebarViews {
//   "default" = "default",
//   "cloud" = "cloud",
//   "local" = "local",
//   "tags" = "tags",
//   "stats" = "stats",
// }
// enum SidebarSubviews {
//   "ALL" = "ALL",
//   "TRASH" = "TRASH",
//   "INBOX" = "INBOX",
//   "GROUP" = "GROUP",
// }
// enum SidebarPaths {
//   navigator_deafult_all = "navigator_deafult_all",
//   primary_cloud_all = "primary_cloud_all",
//   primary_cloud_trash = "primary_cloud_trash",
//   primary_cloud_inbox = "primary_cloud_inbox",
//   primary_cloud_group = "primary_cloud_group",
//   primary_local_all = "primary_local_all",
//   primary_tags_all = "primary_tags_all",
//   secondary_stats = "secondary_stats",
// }
