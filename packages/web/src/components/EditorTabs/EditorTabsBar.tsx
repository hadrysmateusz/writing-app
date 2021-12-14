import { FC } from "react"
import styled from "styled-components/macro"

import { useDocumentsAPI } from "../CloudDocumentsProvider"
import { PrimarySidebarTabs } from "../PrimarySidebar"
import { SecondarySidebarTabs } from "../SecondarySidebar"
import { useTabsAPI, useTabsState } from "../TabsProvider"
import { usePrimarySidebar, useSecondarySidebar } from "../ViewState"

import EditorTab from "./EditorTab"
import EditorTabAdd from "./EditorTabAdd"

const EditorTabsBar: FC = () => {
  const { tabsState } = useTabsState()
  const { openDocument } = useTabsAPI()
  const { createDocument } = useDocumentsAPI()
  const { isOpen: isPrimarySidebarOpen } = usePrimarySidebar()
  const { isOpen: isSecondarySidebarOpen } = useSecondarySidebar()

  const handleDoubleClick = async (e) => {
    if (e.target === e.currentTarget) {
      const document = await createDocument(
        { parentGroup: null },
        {
          switchToDocument: false,
          switchToGroup: false,
        }
      )
      openDocument(document.id, { inNewTab: true })
    }
  }

  return (
    <EditorTabsContainer>
      {!isPrimarySidebarOpen ? <PrimarySidebarTabs /> : null}
      <EditorTabsInnerContainer>
        {Object.keys(tabsState.tabs).map((tabId) => (
          <EditorTab key={tabId} tabId={tabId} />
        ))}
        <EditorTabAdd key={"tab-add-button"} />
        <EditorTabsFiller
          onDoubleClick={handleDoubleClick}
          key={"tabs-filler"}
        />
      </EditorTabsInnerContainer>
      {!isSecondarySidebarOpen ? <SecondarySidebarTabs /> : null}
    </EditorTabsContainer>
  )
}

const EditorTabsFiller = styled.div`
  flex-grow: 1;
`

const EditorTabsContainer = styled.div`
  background: var(--bg-100);
  height: var(--tab-size);
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: stretch;
  justify-content: start;
  user-select: none;
`

const EditorTabsInnerContainer = styled.div`
  flex-shrink: 1;
  background: var(--bg-100);
  height: var(--tab-size);
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: stretch;
  justify-content: start;
  user-select: none;
`

export default EditorTabsBar
