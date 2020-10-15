import { SECONDARY_VIEWS, VIEWS } from "../../constants"
import { LocalSettings } from "../Database"

const defaultLocalSettings: LocalSettings = {
  expandedKeys: [],
  unsyncedDocs: [],
  currentEditor: null,
  primarySidebarCurrentView: VIEWS.ALL,
  secondarySidebarCurrentView: SECONDARY_VIEWS.SNIPPETS,
  primarySidebarIsOpen: true,
  secondarySidebarIsOpen: true,
  navigatorSidebarIsOpen: true,
}

export default defaultLocalSettings
