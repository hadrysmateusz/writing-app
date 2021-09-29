import { LocalSettings } from "../Database"
import {
  CloudViews,
  LocalViews,
  PrimarySidebarViews,
  SecondarySidebarViews,
  SnippetsViews,
} from "../ViewState/types" // TODO: has to be imported from /types directly to avoid a circular import

const defaultLocalSettings: LocalSettings = {
  expandedKeys: [],
  unsyncedDocs: [],
  currentEditor: null,
  primarySidebarCurrentView: PrimarySidebarViews.cloud,
  primarySidebarCurrentSubviews: {
    cloud: CloudViews.ALL,
    local: LocalViews.ALL,
    snippets: SnippetsViews.ALL,
  },
  secondarySidebarCurrentView: SecondarySidebarViews.stats,
  primarySidebarIsOpen: true,
  secondarySidebarIsOpen: true,
  navigatorSidebarIsOpen: true,
}

export default defaultLocalSettings
