import { Reducer } from "react"
import { v4 as uuidv4 } from "uuid"

export type TabTypes = "cloudDocument" | "cloudNew"

type CreateTabActionBase = { type: "create-tab"; switch: boolean }

type CreateTabActionVariants =
  | {
      tabType: "cloudDocument"
      documentId: string
    }
  | {
      tabType: "cloudNew"
    }

export type CreateTabAction = CreateTabActionBase & CreateTabActionVariants

type TabsStateTabBase = {
  tabId: string
}

type TabsStateTabVariants =
  | {
      tabType: "cloudDocument"
      documentId: string
    }
  | { tabType: "cloudNew" }

// When changing typing of TabsStateTab, remember to update validator in getLocalSetting
export type TabsStateTab = TabsStateTabBase & TabsStateTabVariants
export type TabsState = {
  tabs: { [tabId: string]: TabsStateTab }
  currentTab: string
}
export type TabsAction =
  | CreateTabAction
  | { type: "switch-tab"; tabId: string }
  | { type: "close-tab"; tabId: string }
  | { type: "change-document"; tabId: string; documentId: string }
  | { type: "set-state"; newState: TabsState }

export type TabsReducer = Reducer<TabsState, TabsAction>

export const tabsReducer = function (persist: (value: TabsState) => void) {
  return function (state: TabsState, action: TabsAction): TabsState {
    console.log("tabs action:", action.type, action)
    let newState: TabsState = state
    switch (action.type) {
      case "set-state": {
        newState = action.newState
        break
      }
      case "switch-tab": {
        if (!state.tabs[action.tabId]) {
          throw new Error(
            `Can't switch tab. Reason: Tab with id: ${action.tabId} doesn't exist`
          )
        }
        newState = { ...state, currentTab: action.tabId }
        break
      }
      case "create-tab": {
        // TODO: figure out if I should check for the existence of a tab with this document here or whatever function wraps the dispatch
        const newTabId = uuidv4()
        const newCurrentTab = !!action.switch ? newTabId : state.currentTab

        switch (action.tabType) {
          case "cloudDocument": {
            newState = {
              tabs: {
                ...state.tabs,
                [newTabId]: {
                  tabId: newTabId,
                  tabType: "cloudDocument",
                  documentId: action.documentId,
                },
              },
              currentTab: newCurrentTab,
            }
            break
          }
          case "cloudNew": {
            newState = {
              tabs: {
                ...state.tabs,
                [newTabId]: {
                  tabId: newTabId,
                  tabType: "cloudNew",
                },
              },
              currentTab: newCurrentTab,
            }
            break
          }
        }
        break
      }
      case "close-tab": {
        const { tabId } = action

        if (!state.tabs[tabId]) {
          console.warn("Attempted to close a tab that doesn't exist")
          break
        }

        const { [tabId]: removedTab, ...remainingTabs } = state.tabs

        if (tabId === state.currentTab) {
          console.log("Closed current tab!")
          const tabIds = Object.keys(state.tabs)
          const removedTabIndex = tabIds.findIndex((t) => t === tabId)
          const remainingTabIds = Object.keys(remainingTabs)
          const newCurrentTabIndex =
            removedTabIndex < remainingTabIds.length - 1
              ? removedTabIndex
              : removedTabIndex - 1
          newState = {
            // Switch to a different tab if the closed tab was the current one
            currentTab: remainingTabIds[newCurrentTabIndex] ?? null,
            tabs: remainingTabs,
          }
        } else {
          newState = { ...state, tabs: remainingTabs }
        }
        break
      }
      case "change-document":
        throw new Error("unimplemented")
      // if (!state.tabs[action.tabId]) {
      //   console.warn(
      //     "Attempted to change content of a tab that doesn't exist"
      //   )
      //   break
      // }
      // newState = {
      //   ...state,
      //   tabs: {
      //     ...state.tabs,
      //     [action.tabId]: {
      //       ...state.tabs[action.tabId],
      //       documentId: action.documentId,
      //     },
      //   },
      // }
      // break
      default: {
        newState = state
      }
    }
    persist(newState)
    return newState
  }
}

export function tabsInit(): TabsState {
  const tabId = "__DEFAULT__"
  return {
    tabs: {
      [tabId]: {
        tabId: tabId,
        tabType: "cloudNew",
      },
    },
    currentTab: tabId,
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
