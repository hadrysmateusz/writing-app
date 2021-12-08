import { LocalSettings } from "../Database"
import { TabsState } from "../MainProvider/tabsSlice"
import { SIDEBAR_VAR } from "../ViewState/types"

export const defaultLocalSettings: LocalSettings = {
  expandedKeys: { cloud: [], local: [] },
  unsyncedDocs: [],
  tabs: tabsInit(),
  localDocPaths: [],
  sidebars: {
    navigator: {
      isOpen: true,
      currentView: "default",
      currentPaths: {
        default: SIDEBAR_VAR.navigator.default.all,
      },
    },
    primary: {
      isOpen: true,
      currentView: "cloud",
      currentPaths: {
        cloud: SIDEBAR_VAR.primary.cloud.all,
        local: SIDEBAR_VAR.primary.local.all,
        tags: SIDEBAR_VAR.primary.tags.all,
      },
    },
    secondary: {
      isOpen: true,
      currentView: "stats",
      currentPaths: {
        stats: SIDEBAR_VAR.secondary.stats.all,
      },
    },
  },
}

export function tabsInit(): TabsState {
  const tabId = "__DEFAULT__"
  return {
    tabs: {
      [tabId]: {
        tabId: tabId,
        tabType: "cloudNew",
        keep: false,
      },
    },
    currentTab: tabId,
  }
}

export default defaultLocalSettings
