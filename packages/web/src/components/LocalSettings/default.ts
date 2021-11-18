import { LocalSettings } from "../Database"
import { TabsState } from "../MainProvider/tabsSlice"
import {
  CloudViews,
  LocalViews,
  PrimarySidebarViews,
  SecondarySidebarViews,
  SnippetsViews,
  TagsViews,
} from "../ViewState/types" // TODO: has to be imported from /types directly to avoid a circular import

export const defaultLocalSettings: LocalSettings = {
  expandedKeys: [],
  unsyncedDocs: [],
  tabs: tabsInit(),
  primarySidebarCurrentView: PrimarySidebarViews.cloud,
  primarySidebarCurrentSubviews: {
    cloud: CloudViews.ALL,
    local: LocalViews.ALL,
    snippets: SnippetsViews.ALL,
    tags: TagsViews.ALL,
  },
  secondarySidebarCurrentView: SecondarySidebarViews.stats,
  primarySidebarIsOpen: true,
  secondarySidebarIsOpen: true,
  navigatorSidebarIsOpen: true,
}

export function tabsInit(): TabsState {
  const tabId = "__DEFAULT__"
  return {
    tabs: {
      [tabId]: {
        tabId: tabId,
        tabType: "cloudNew",
      },
    },
    currentTab: tabId,
  }
}

export default defaultLocalSettings
