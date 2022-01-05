import { GenericDocGroupTree_Discriminated } from "../../../types"

import { TabsState } from "../../TabsProvider/tabsSlice"

/**
 * Checks tabs state for a tab with a local document with path matching the param
 * @returns tabId of the tab containing the document or null if such tab wasn't found
 */
export function findTabWithPath(
  tabsState: TabsState,
  path: string
): string | null {
  let foundTabId: string | null = null
  Object.entries(tabsState.tabs).some(([tabId, tab]) => {
    if (tab.tabType === "localDocument" && tab.path === path) {
      foundTabId = tabId
      return true
    }
    return false
  })
  return foundTabId
}

export const createParentGroupingItemSubviewPath = (
  genericGroupTree: GenericDocGroupTree_Discriminated | undefined,
  baseSubview: string,
  fallbackSubview: string
) => {
  return genericGroupTree?.identifier
    ? `${baseSubview}_${genericGroupTree.parentIdentifier}`
    : fallbackSubview
}
