import { RxDocument, RxCollection } from "rxdb"

/**
 * Contains only the actual user preferences/settings, for use elsewhere
 */
export type UserSettings = {
  isSpellCheckEnabled: boolean
}

/**
 * Contains mutable, user-editable data about the user like:
 *
 * - preferences/settings
 * - onboarding status (which features has the user interacted with already)
 *
 * Sensitive data, like subscription status etc. shouldn't be stored here,
 * but in a separate, cloud-only database that can only be interacted with
 * through a secure API.
 *
 * Local preferences that shouldn't be synced with the cloud shouldn't be stored here,
 * but in a separate, local-only RxDB database
 */
export type UserdataDocType = UserSettings & {
  /**
   * UID of the user this settings object belongs to
   */
  userId: string
}

export type UserdataDocMethods = {}

export type UserdataDoc = RxDocument<UserdataDocType, UserdataDocMethods>

export type UserdataCollectionMethods = {}

export type UserdataCollection = RxCollection<
  UserdataDocType,
  UserdataDocMethods,
  UserdataCollectionMethods
>
