import { TabsState, TabsStateTab, TabTypes } from "./tabsSlice"

export type OpenDocumentFn = (
  documentId: string,
  options?: { inNewTab?: boolean }
) => null

export type TabsStateContextType = {
  tabsState: TabsState
  currentDocumentId: string | null
  currentTabObject: TabsStateTab
  currentTabType: TabTypes
}

export type TabsAPIContextType = {
  openDocument: OpenDocumentFn
  closeTab: (tabId: string) => void
  closeTabByCloudDocumentId: (documentId: string) => void
}
