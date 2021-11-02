import { FC } from "react"
import styled from "styled-components/macro"

import { useDocumentsAPI, useMainState, useTabsState } from "../MainProvider"
import { PrimarySidebarTabs } from "../PrimarySidebar"
import { SecondarySidebarTabs } from "../SecondarySidebar"
import { useViewState } from "../ViewState"

import EditorTab from "./EditorTab"
import EditorTabAdd from "./EditorTabAdd"

const EditorTabsBar: FC = () => {
  const { openDocument } = useMainState()
  const tabsState = useTabsState()
  const { createDocument } = useDocumentsAPI()
  const { primarySidebar, secondarySidebar } = useViewState()

  const handleDoubleClick = async (e) => {
    if (e.target === e.currentTarget) {
      const document = await createDocument(null, undefined, {
        switchToDocument: false,
        switchToGroup: false,
      })
      openDocument(document.id, { inNewTab: true })
    }
  }

  const onlyHasOneTab = Object.keys(tabsState.tabs).length === 1

  return (
    <EditorTabsContainer>
      {!primarySidebar.isOpen ? <PrimarySidebarTabs /> : null}
      {Object.keys(tabsState.tabs).map((tabId) => (
        <EditorTab key={tabId} tabId={tabId} isOnlyTab={onlyHasOneTab} />
      ))}
      <EditorTabAdd />
      <EditorTabsFiller onDoubleClick={handleDoubleClick} />
      {!secondarySidebar.isOpen ? <SecondarySidebarTabs /> : null}
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
  display: flex;
  align-items: stretch;
  justify-content: start;
  user-select: none;
`

export default EditorTabsBar
