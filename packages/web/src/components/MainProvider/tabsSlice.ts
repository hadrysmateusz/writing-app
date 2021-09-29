import { Reducer } from "react"
import { v4 as uuidv4 } from "uuid"

export type TabsStateTab = { documentId: string | null }
export type TabsState = {
  tabs: { [tabId: string]: TabsStateTab }
  currentTab: string
}
export type TabsAction =
  | { type: "switch-tab"; tabId: string }
  | { type: "create-tab"; documentId: string; switch: boolean }
  | { type: "close-tab"; tabId: string }
  | { type: "change-document"; tabId: string; documentId: string }

export type TabsReducer = Reducer<TabsState, TabsAction>

// TODO: make the persist function save the entire state including tabs list
export const tabsReducer = function (persist: (value: string) => void) {
  return function (state: TabsState, action: TabsAction): TabsState {
    // console.log("reducer", action, state)
    console.log("tabs action:", action.type, action)
    switch (action.type) {
      case "switch-tab":
        if (!state.tabs[action.tabId]) {
          throw new Error(
            `Can't switch tab. Reason: Tab with id: ${action.tabId} doesn't exist`
          )
        }
        persist(action.tabId)
        return { ...state, currentTab: action.tabId }
      case "create-tab":
        // TODO: figure out if I should check for the existence of a tab with this document here or whatever funciton wraps the dispatch
        const newTabId = uuidv4()
        const newCurrentTab = !!action.switch ? newTabId : state.currentTab
        persist(newCurrentTab)
        return {
          tabs: {
            ...state.tabs,
            [newTabId]: { documentId: action.documentId },
          },
          currentTab: newCurrentTab,
        }
      case "close-tab":
        // TODO: if you close current tab switch to another
        if (!state.tabs[action.tabId]) {
          console.warn("Attempted to close a tab that doesn't exist")
          return state
        }
        const { [action.tabId]: removedTab, ...remainingTabs } = state.tabs
        return { ...state, tabs: remainingTabs }
      case "change-document":
        if (!state.tabs[action.tabId]) {
          console.warn(
            "Attempted to change content of a tab that doesn't exist"
          )
          return state
        }
        return {
          ...state,
          tabs: {
            ...state.tabs,
            [action.tabId]: {
              ...state.tabs[action.tabId],
              documentId: action.documentId,
            },
          },
        }
    }
  }
}

export function tabsInit(currentEditor: string | null): TabsState {
  const id = uuidv4()
  return {
    currentTab: id,
    tabs: {
      [id]: { documentId: currentEditor },
    },
  }
}

// export const tabsInitialState: TabsState = tabsInit()

// import { Reducer } from "react"
// import { v4 as uuidv4 } from "uuid"

// export type TabsStateTab = { type: "document"; title } | { type: "empty" }
// export type TabsState = {
//   tabs: { [documentId: string]: TabsStateTab }
//   currentTab: string
// }
// export type TabsAction =
//   | { type: "switch-tab"; tabId: string }
//   | { type: "create-tab"; tabId: string; title: string; switch: boolean }
//   | { type: "close-tab"; tabId: string }

// export type TabsReducer = Reducer<TabsState, TabsAction>

// export const tabsReducer: TabsReducer = function (
//   state: TabsState,
//   action: TabsAction
// ): TabsState {
//   switch (action.type) {
//     case "switch-tab":
//       if (!state.tabs[action.tabId]) {
//         throw new Error(
//           `Can't switch tab. Reason: Tab with id: ${action.tabId} doesn't exist`
//         )
//       }
//       return { ...state, currentTab: action.tabId }
//     case "create-tab":
//       if (!!state.tabs[action.tabId]) {
//         throw new Error(
//           `Can't create tab. Reason: Tab with id: ${action.tabId} already exists`
//         )
//       }
//       return {
//         tabs: {
//           ...state.tabs,
//           [action.tabId]: { type: "document", title: action.title },
//         },
//         currentTab: !!action.switch ? action.tabId : state.currentTab,
//       }
//     case "close-tab":
//       if (!state.tabs[action.tabId]) {
//         console.warn("Attempted to close a tab that doesn't exist")
//         return state
//       }
//       const { [action.tabId]: removedTab, ...remainingTabs } = state.tabs
//       return { ...state, tabs: remainingTabs }
//   }
// }

// function tabsInit(): TabsState {
//   const tabId = uuidv4()
//   return {
//     tabs: { [tabId]: { type: "empty" } },
//     currentTab: tabId,
//   }
// }

// export const tabsInitialState: TabsState = tabsInit()
