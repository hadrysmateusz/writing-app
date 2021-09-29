import { FC } from "react"
import styled from "styled-components/macro"
import { useDocumentsAPI, useMainState, useTabsState } from "../MainProvider"
import EditorTab from "./EditorTab"

const EditorTabsBar: FC = () => {
  const { openDocument } = useMainState()
  const tabsState = useTabsState()
  const { createDocument } = useDocumentsAPI()

  const handleClick = async (e) => {
    if (e.target === e.currentTarget) {
      const document = await createDocument(null, undefined, {
        switchToDocument: false,
      })
      openDocument(document.id, { inNewTab: true })
    }
  }

  return (
    <EditorTabsContainer onClick={handleClick}>
      {Object.keys(tabsState.tabs).map((tabId) => (
        <EditorTab key={tabId} tabId={tabId} />
      ))}
    </EditorTabsContainer>
  )
}

const EditorTabsContainer = styled.div`
  background: var(--bg-100);
  height: var(--tab-size);
  width: 100%;
  display: flex;
  align-items: stretch;
  justify-content: start;
`

export default EditorTabsBar
