import { RxDocument, RxCollection } from "rxdb"

import { TabsState } from "../../../TabsProvider/tabsSlice"
import { SidebarSidebar, SidebarView } from "../../../ViewState"

type NewSidebarType<S extends SidebarSidebar> = {
  // id: string
  isOpen: boolean
  currentView: SidebarView<S>
  currentPaths: Record<SidebarView<S>, string>
}

/**
 * Contains only the actual user preferences/settings, for use elsewhere
 */
export type LocalSettings = {
  /**
   * Array of IDs for tree items that should be expanded (mostly corresponding to group IDs)
   */
  expandedKeys: {
    cloud: string[]
    local: string[]
  }
  /**
   * Array of IDs for documents that have unsynced changes
   */
  unsyncedDocs: string[]
  /**
   * Tabs state
   */
  tabs: TabsState
  /**
   * Saved local directory paths
   */
  localDocPaths: string[]
  /**
   * New combined sidebars state
   */
  sidebars: {
    navigator: NewSidebarType<"navigator">
    primary: NewSidebarType<"primary">
    secondary: NewSidebarType<"secondary">
  }
}

export type LocalSettingsDocType = Omit<LocalSettings, "tabs"> & {
  /**
   * UID of the user this local settings object belongs to
   */
  userId: string
  /**
   * For the databse doc we replace the type of the tabs object with string as it has to be stringified
   * TODO: it's almost certainly possible to use the same data structure for the database, just figure out the correct JSONSchema
   */
  tabs: string
}

export type LocalSettingsDocMethods = {}

export type LocalSettingsDoc = RxDocument<
  LocalSettingsDocType,
  LocalSettingsDocMethods
>

export type LocalSettingsCollectionMethods = {}

export type LocalSettingsCollection = RxCollection<
  LocalSettingsDocType,
  LocalSettingsDocMethods,
  LocalSettingsCollectionMethods
>
