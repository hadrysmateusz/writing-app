import { SECONDARY_VIEWS, VIEWS } from "../../constants"
import { LocalSettings } from "../Database"

const defaultLocalSettings: LocalSettings = {
  expandedKeys: [],
  currentEditor: null,
  primarySidebarCurrentView: VIEWS.ALL,
  secondarySidebarCurrentView: SECONDARY_VIEWS.SNIPPETS,
}

export default defaultLocalSettings
