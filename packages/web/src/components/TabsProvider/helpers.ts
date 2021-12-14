import { TabsState } from "./tabsSlice"

/**
 * @returns string if there is a cloud document opened in the current tab, null if not
 */
export const getCurrentCloudDocumentId = (
  tabsState: TabsState
): string | null => {
  const currentTab = tabsState.tabs[tabsState.currentTab]

  if (!currentTab) {
    console.warn(
      "handle this error more gracefully with some form of fallback",
      tabsState
    )
    // throw new Error("no tab with this id")
    return null
  }

  if (currentTab.tabType === "cloudDocument") {
    return currentTab.documentId
  }

  return null
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
