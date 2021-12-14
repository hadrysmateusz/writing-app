import { DocumentDoc } from "../Database"

import { TabsState, TabsStateTab, TabTypes } from "./tabsSlice"

export type OpenDocumentFn = (
  documentId: string,
  options?: { inNewTab?: boolean }
) => null

export type TabsStateContextType = {
  tabsState: TabsState

  currentCloudDocumentId: string | null
  currentCloudDocument: DocumentDoc | null
  isLoadingCurrentCloudDocument: boolean

  currentTabObject: TabsStateTab
  currentTabType: TabTypes
}

export type TabsAPIContextType = {
  openDocument: OpenDocumentFn
  closeTab: (tabId: string) => void
  closeTabByCloudDocumentId: (documentId: string) => void
}
