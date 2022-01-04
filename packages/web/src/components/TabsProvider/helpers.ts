import { DUMMY_EDITOR_PLATE_ID } from "../Editor/SpecializedEditors"

import { TabsState, TabsStateTab } from "./tabsSlice"
import { TabsStateShapeError } from "./misc"

/**
 * Gets the current tab object based on tabsState. If one is not found it's most likely an invalid state shape so a NoTabError is thrown
 * @returns TabsStateTab object of the current tab
 */
export const getCurrentTabObject = (tabsState: TabsState): TabsStateTab => {
  const currentTab = tabsState.tabs[tabsState.currentTab]

  if (!currentTab) {
    console.warn("no tab with this id", tabsState)
    throw new TabsStateShapeError(
      `No tab with this id: ${tabsState.currentTab}`
    )
  }

  return currentTab
}

/**
 * @returns string if there is a cloud document opened in the current tab, null if not
 *
 * TODO: replace all refrences with the new universal getCurrentDocumentIdentifier
 */
export const getCurrentCloudDocumentId = (
  tabsState: TabsState
): string | null => {
  try {
    const currentTab = getCurrentTabObject(tabsState)

    if (currentTab.tabType === "cloudDocument") {
      return currentTab.documentId
    }

    return null
  } catch (error) {
    // in case of NoTabError, return null...
    if (error instanceof TabsStateShapeError) {
      return null
    }
    // ...otherwise rethrow
    throw error
  }
}

/**
 * @returns
 * - string corresponding to document identifier if there is a document opened in current tab
 * - DUMMY_EDITOR_PLATE_ID if current tab is a cloudNew tab
 * - In case of invalid TabsState shape, throws a TabsStateShapeError
 */
export const getCurrentDocumentIdentifier = (tabsState: TabsState): string => {
  const currentTab = getCurrentTabObject(tabsState)

  switch (currentTab.tabType) {
    case "cloudDocument": {
      return currentTab.documentId
    }
    case "localDocument": {
      return currentTab.path
    }
    case "cloudNew": {
      return DUMMY_EDITOR_PLATE_ID // TODO: maybe replace this with null
    }
    default: {
      throw new TabsStateShapeError(`invalid tabType`)
    }
  }
}

/**
 * Checks tabs state for a tab with a cloud document with documentId matching the param
 * @returns tabId of the tab containing the document or null if such tab wasn't found
 */
export function findTabWithDocumentId(
  tabsState: TabsState,
  documentId: string
): string | null {
  let foundTabId: string | null = null
  Object.entries(tabsState.tabs).some(([tabId, tab]) => {
    if (tab.tabType === "cloudDocument" && tab.documentId === documentId) {
      foundTabId = tabId
      return true
    }
    return false
  })
  return foundTabId
}
