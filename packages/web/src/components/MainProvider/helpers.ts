import { Subscription } from "rxjs"
import { TabsState } from "./tabsSlice"

export const cancelSubscription = (sub: Subscription | undefined) => {
  if (sub) {
    sub.unsubscribe()
  }
}

export const cancelSubscriptions = (...subs: (Subscription | undefined)[]) => {
  subs.forEach((sub) => cancelSubscription(sub))
}

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
    throw new Error("no tab with this id")
  }

  if (currentTab.tabType === "cloudDocument") {
    return currentTab.documentId
  }

  return null
}
