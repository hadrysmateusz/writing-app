import { SECONDARY_VIEWS } from "../../constants"
import { LocalSettings } from "../Database"
// import {
//   PrimarySidebarViews,
//   CloudViews,
//   LocalViews,
//   SnippetsViews,
// } from "../ViewState"

const defaultLocalSettings: LocalSettings = {
  expandedKeys: [],
  unsyncedDocs: [],
  currentEditor: null,
  primarySidebarCurrentView: "cloud",
  primarySidebarCurrentSubviews: {
    cloud: "cloud_all",
    local: "local_all",
    snippets: "snippets_all",
  },
  secondarySidebarCurrentView: SECONDARY_VIEWS.SNIPPETS,
  primarySidebarIsOpen: true,
  secondarySidebarIsOpen: true,
  navigatorSidebarIsOpen: true,
}

export default defaultLocalSettings
