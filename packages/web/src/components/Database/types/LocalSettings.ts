import { RxDocument, RxCollection } from "rxdb"

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
   * Current editor (most likely corresponding to document id)
   */
  currentEditor: string | null
  /**
   * Current view for the primary sidebar
   */
  primarySidebarCurrentView: string
  /**
   * Current view for the secondary sidebar
   */
  secondarySidebarCurrentView: string
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

export type LocalSettingsDocType = LocalSettings & {
  /**
   * UID of the user this local settings object belongs to
   */
  userId: string
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