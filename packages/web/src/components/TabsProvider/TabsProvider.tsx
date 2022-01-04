import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  memo,
  useReducer,
} from "react"

import { createContext } from "../../utils"
import { useRxSubscription } from "../../hooks"

import { defaultLocalSettings, useLocalSettings } from "../LocalSettings"
import { AppLoadingState } from "../AppLoadingState"
import { useDatabase } from "../Database"

import {
  findTabWithDocumentId,
  getCurrentCloudDocumentId,
  getCurrentDocumentIdentifier,
} from "./helpers"
import { TabsAction, TabsReducer, tabsReducer, TabsState } from "./tabsSlice"
import {
  OpenDocumentFn,
  TabsAPIContextType,
  TabsStateContextType,
} from "./types"

export const [TabsStateContext, useTabsState] =
  createContext<TabsStateContextType>()

export const [TabsAPIContext, useTabsAPI] = createContext<TabsAPIContextType>()

export const [TabsDispatchContext, useTabsDispatch] =
  createContext<React.Dispatch<TabsAction>>()

// TODO: make methods using IDs to find documents/groups/etc accept the actual RxDB document object instead to skip the query
// TODO: create document history. When the current document is deleted move to the previous one if available, and maybe even provide some kind of navigation arrows.

export const TabsProvider: React.FC = memo(({ children }) => {
  const db = useDatabase()
  const { updateLocalSetting, getLocalSetting } = useLocalSettings()

  // Flag to manage whether this is the first time the app is loaded
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Create tabsReducer
  const tabsReducer_ = useMemo(() => {
    return tabsReducer((value: TabsState) => {
      // the set timeout is necessary to prevent an error caused by updating another component's state while this one is rendering
      setTimeout(() => {
        updateLocalSetting("tabs", value)
      }, 0)
    })
  }, [updateLocalSetting])

  const [tabsState, tabsDispatch] = useReducer<TabsReducer>(
    tabsReducer_,
    defaultLocalSettings.tabs
  )

  const currentCloudDocumentId = getCurrentCloudDocumentId(tabsState)

  const {
    data: currentCloudDocument,
    isLoading: isLoadingCurrentCloudDocument,
  } = useRxSubscription(
    db.documents.findOne().where("id").eq(currentCloudDocumentId)
  )

  // console.log("TABS STATE:", JSON.stringify(tabsState, null, 2))

  // TODO: catch the possible TabsStateShapeError and reset tabs state
  const currentDocumentId = getCurrentDocumentIdentifier(tabsState)

  useEffect(() => {
    // TODO: check if this actually does something
    if (tabsState.currentTab === null) {
      const tabIds = Object.keys(tabsState.tabs)
      if (tabIds.length >= 1) {
        tabsDispatch({ type: "switch-tab", tabId: tabIds[0] })
      } else {
        tabsDispatch({ type: "create-tab", tabType: "cloudNew", switch: true })
      }
    }
  }, [tabsState.currentTab, tabsState.tabs])

  /**
   * Fetches all things required for the app to run
   * TODO: reassess which parts of this are still required
   */
  useEffect(() => {
    if (isInitialLoad) {
      ;(async () => {
        const initialTabsState = await getLocalSetting("tabs")

        tabsDispatch({ type: "set-state", newState: initialTabsState })

        // const newCurrentDocId = getCurrentCloudDocumentId(initialTabsState)

        // if (newCurrentDocId !== null) {
        //   fetchDocument(newCurrentDocId) // TODO: probably remove dependency on this function as it relates to the old way of storing currentDocument
        // }

        // if (newCurrentDocId === null) {
        //   const document = await createDocument(null, undefined, {
        //     switchToDocument: false,
        //     switchToGroup: false,
        //   })
        //   setCurrentDocument(document)
        //   setIsDocumentLoading(false)
        //   tabsDispatch({
        //     type: "create-tab",
        //     documentId: document.id,
        //     switch: true,
        //   })
        // } else {
        //   const docId =
        //     initialTabsState.tabs[initialTabsState.currentTab].documentId
        //   await fetchDocument(docId)
        // }

        setIsInitialLoad(false)
      })()
    }
  }, [getLocalSetting, isInitialLoad])

  const closeTab = useCallback((tabId) => {
    tabsDispatch({ type: "close-tab", tabId })
  }, [])

  const closeTabByCloudDocumentId = useCallback(
    (documentId: string) => {
      let foundTabId = findTabWithDocumentId(tabsState, documentId)
      if (foundTabId !== null) {
        closeTab(foundTabId)
      }
    },
    [closeTab, tabsState]
  )

  /**
   * Opens a cloud document in the editor
   */
  const openDocument = useCallback<OpenDocumentFn>(
    function (documentId, options = {}) {
      const { inNewTab = true } = options

      console.log("openDocument called", documentId, options)

      // Check if tab with this documentId already exists
      const tabId = findTabWithDocumentId(tabsState, documentId)
      // Tab with this document already exists, switch to it
      if (tabId !== null) {
        tabsDispatch({ type: "switch-tab", tabId })
      } else {
        const tempTab = Object.values(tabsState.tabs).find(
          (tab) => tab.keep === false
        )
        // if there is a tab with keep === false, we reuse that tab
        if (!!tempTab) {
          tabsDispatch({
            type: "replace-tab",
            tab: {
              tabId: tempTab.tabId,
              tabType: "cloudDocument",
              documentId: documentId,
              keep: false,
            },
            switch: true,
          })
        }
        // Open document in new tab
        else if (currentCloudDocumentId === null || inNewTab) {
          tabsDispatch({
            type: "create-tab",
            tabType: "cloudDocument",
            documentId: documentId,
            switch: true,
          })
        }
        // Open document in current tab
        else if (tabsState.currentTab !== null) {
          // TODO: this currently doesn nothing (figure out what to do with it)
          tabsDispatch({
            type: "change-document",
            tabId: tabsState.currentTab,
            documentId: documentId,
          })
        }
        // Invalid scenario
        else {
          throw new Error("Couldn't open document")
        }
      }

      return null

      // return fetchDocument(documentId) // TODO: probably remove dependency on this function as it relates to the old way of storing currentDocument
    },
    [currentCloudDocumentId, tabsState]
  )

  // TODO: rename tabsState.currentTab to currentTabId and this to currentTab
  const currentTabObject = useMemo(
    () => tabsState.tabs[tabsState.currentTab],
    [tabsState.currentTab, tabsState.tabs]
  )

  const currentTabType = useMemo(
    () => currentTabObject.tabType,
    [currentTabObject.tabType]
  )

  const tabsAPIContextValue: TabsAPIContextType = useMemo(
    () => ({
      openDocument,
      closeTab,
      closeTabByCloudDocumentId,
    }),
    [closeTab, closeTabByCloudDocumentId, openDocument]
  )

  const tabsStateContextValue: TabsStateContextType = useMemo(
    () => ({
      tabsState,

      currentDocumentId,

      // TODO: probably eventually replace (or supplement) with a generic currentDocument____ methods that get an abstracted current cloud/local document
      currentCloudDocumentId,
      currentCloudDocument,
      isLoadingCurrentCloudDocument,

      currentTabObject,
      currentTabType,
    }),
    [
      currentCloudDocument,
      currentCloudDocumentId,
      currentDocumentId,
      currentTabObject,
      currentTabType,
      isLoadingCurrentCloudDocument,
      tabsState,
    ]
  )

  return (
    <TabsAPIContext.Provider value={tabsAPIContextValue}>
      <TabsStateContext.Provider value={tabsStateContextValue}>
        <TabsDispatchContext.Provider value={tabsDispatch}>
          {isInitialLoad ? <AppLoadingState /> : children}
        </TabsDispatchContext.Provider>
      </TabsStateContext.Provider>
    </TabsAPIContext.Provider>
  )
})
