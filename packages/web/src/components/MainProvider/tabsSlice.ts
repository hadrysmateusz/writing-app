import { Reducer } from "react"
import { v4 as uuidv4 } from "uuid"
import { defaultLocalSettings } from "../LocalSettings"

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
  keep: boolean
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
  | { type: "keep-tab"; tabId: string | null }
  | {
      type: "replace-tab"
      tab: TabsStateTab
      switch: boolean
    }

export type TabsReducer = Reducer<TabsState, TabsAction>

export const tabsReducer = function (persist: (value: TabsState) => void) {
  return function (state: TabsState, action: TabsAction): TabsState {
    console.log("tabs action:", action.type, action)
    let newState: TabsState = state
    switch (action.type) {
      // replaces full state with any valid state object
      case "set-state": {
        newState = action.newState
        break
      }
      // switches to another tab by id
      case "switch-tab": {
        if (!state.tabs[action.tabId]) {
          throw new Error(
            `Can't switch tab. Reason: Tab with id: ${action.tabId} doesn't exist`
          )
        }
        newState = { ...state, currentTab: action.tabId }
        break
      }
      // changes a given tab's keep property to true
      case "keep-tab": {
        // If provided tabId is null, use current tab
        const tabId = action.tabId === null ? state.currentTab : action.tabId

        newState = {
          ...state,
          tabs: {
            ...state.tabs,
            [tabId]: {
              ...state.tabs[tabId],
              keep: true,
            },
          },
        }
        break
      }
      // creates a new tab with given properties
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
                  keep: false,
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
                  keep: false,
                },
              },
              currentTab: newCurrentTab,
            }
            break
          }
        }
        break
      }
      // given a tab object, replaces a tab with its id with the new tab object, overwriting its properties
      case "replace-tab": {
        const { tab } = action
        const newCurrentTab = !!action.switch ? tab.tabId : state.currentTab

        if (!Object.keys(state.tabs).includes(tab.tabId)) {
          console.warn("Attempted to close a tab that doesn't exist")
          // TODO: handle this better, maybe by simply creating a new tab with this data
          break
        }

        newState = {
          ...state,
          tabs: {
            ...state.tabs,
            [tab.tabId]: tab,
          },
          currentTab: newCurrentTab,
        }
        break
      }
      // closes a tab by id
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
          // The possibility of a null value has to be manually specified as typescript doesn't seem to understand that not all indexes in an array will have a valid value
          const newCurrentTabId: string | null =
            remainingTabIds[newCurrentTabIndex] ?? null

          if (newCurrentTabId === null || remainingTabIds.length === 0) {
            // if tabs would be left in an invalid state, fallback to default
            newState = defaultLocalSettings.tabs
          } else {
            newState = {
              currentTab: newCurrentTabId,
              tabs: remainingTabs,
            }
          }
        } else {
          newState = { ...state, tabs: remainingTabs }
        }
        break
      }
      default: {
        newState = state
      }
    }
    persist(newState)
    return newState
  }
}
