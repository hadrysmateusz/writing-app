import { RxDocument, RxCollection } from "rxdb"

export type LocalSettingsDocType = {
  /**
   * Array of IDs for tree items that should be expanded (mostly corresponding to group IDs)
   */
  expandedKeys: string[]
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
