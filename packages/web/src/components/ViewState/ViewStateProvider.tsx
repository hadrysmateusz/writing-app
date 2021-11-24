import { FC } from "react"

import { NavigatorSidebarProvider } from "./NavigatorSidebarContext"
import { PrimarySidebarProvider } from "./PrimarySidebarContext"
import { SecondarySidebarProvider } from "./SecondarySidebarContext"

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

export const ViewStateProvider: FC<{}> = ({ children }) => {
  // const [isLoading, setIsLoading] = useState(true)

  // const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  // useEffect(() => {
  //   ;(async () => {
  //     const sidebars = await getLocalSetting("sidebars")
  //     const expandedKeys = await getLocalSetting("expandedKeys")

  //     setPrimarySidebarCurrentView(sidebars.primary.currentView)
  //     setSecondarySidebarCurrentView(sidebars.secondary.currentView)

  //     setPrimarySidebarCurrentSubviews(sidebars.primary.currentPaths)

  //     setExpandedKeys(expandedKeys)

  //     setIsLoading(false)
  //   })()
  // }, [getLocalSetting])

  // TODO: instead of many separate state variables use a single complex state (that better matches the one saved in LocalSettings) with a reducer

  return (
    <NavigatorSidebarProvider>
      <PrimarySidebarProvider>
        <SecondarySidebarProvider>{children}</SecondarySidebarProvider>
      </PrimarySidebarProvider>
    </NavigatorSidebarProvider>
  )

  // return (

  //     {isLoading ? <LoadingState /> : children}

  // )
}

// const LoadingState: FC = withDelayRender(1000)(() => <div>Loading...</div>)
