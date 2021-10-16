import { RxDocument, RxCollection } from "rxdb"
import { TabsState } from "../../MainProvider/tabsSlice"
import {
  PrimarySidebarSubviews,
  PrimarySidebarViews,
  SecondarySidebarViews,
} from "../../ViewState"

// type TabsKey

/**
 * Contains only the actual user preferences/settings, for use elsewhere
 */
export type LocalSettings = {
  /**
   * Array of IDs for tree items that should be expanded (mostly corresponding to group IDs)
   */
  expandedKeys: string[]
  /**
   * Array of IDs for documents that have unsynced changes
   */
  unsyncedDocs: string[]
  /**
   * Tabs state
   */
  tabs: TabsState
  /**
   * Current view for the primary sidebar
   */
  primarySidebarCurrentView: PrimarySidebarViews
  /**
   * Current subview for the primary sidebar
   */
  primarySidebarCurrentSubviews: PrimarySidebarSubviews
  /**
   * Current view for the secondary sidebar
   */
  secondarySidebarCurrentView: SecondarySidebarViews
  /**
   * Is primary sidebar open
   */
  primarySidebarIsOpen: boolean
  /**
   * Is secondary sidebar open
   */
  secondarySidebarIsOpen: boolean
  /**
   * Is navigator sidebar open
   */
  navigatorSidebarIsOpen: boolean
}

export type LocalSettingsDocType = Omit<LocalSettings, "tabs"> & {
  /**
   * UID of the user this local settings object belongs to
   */
  userId: string
  /**
   * For the databse doc we replace the type of the tabs object with string as it has to be stringified
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
