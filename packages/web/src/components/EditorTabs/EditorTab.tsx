import { useState, useEffect, FC } from "react"
import styled from "styled-components/macro"

import { useDatabase } from "../Database"
import { useGroupsAPI, useMainState, useTabsState } from "../MainProvider"
import { formatOptional } from "../../utils"

const initialTabData = { title: "", group: null }

const EditorTab: FC<{ tabId: string }> = ({ tabId }) => {
  const db = useDatabase()
  const tabsState = useTabsState()
  const { findGroupById } = useGroupsAPI()
  const { openDocument } = useMainState()

  const isActive = tabsState.currentTab === tabId
  const tab = tabsState.tabs[tabId]
  const [tabData, setTabData] = useState<{
    title: string
    group: string | null
  }>(initialTabData)

  useEffect(() => {
    if (tab.documentId === null) {
      setTabData(initialTabData)
      return undefined
    }
    const sub = db.documents.findOne(tab.documentId).$.subscribe((doc) => {
      if (!doc) {
        // TODO: handle this more gracefully
        throw new Error("Document not found")
      }
      const title = formatOptional(doc?.title, "Untitled")

      if (!doc?.parentGroup) {
        setTabData({
          title: title,
          group: "",
        })
      } else {
        findGroupById(doc.parentGroup).then((group) => {
          setTabData({
            title: title,
            group: group.name,
          })
        })
      }
    })
    return () => sub.unsubscribe()
  }, [db.documents, findGroupById, tab.documentId])

  const handleClick = () => {
    if (isActive) {
      return
    }
    openDocument(tab.documentId)
  }

  return (
    <EditorTabContainer isActive={isActive} onClick={handleClick}>
      <div className="tab-title">{tabData.title}</div>
      {tabData.group ? <div className="tab-group">{tabData.group}</div> : null}
      {/* TODO: add close button */}
    </EditorTabContainer>
  )
}

const EditorTabContainer = styled.div<{ isActive: boolean }>`
  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
  height: var(--tab-size);
  padding: 0 16px;
  font-size: 12px;
  color: ${({ isActive }) => (isActive ? "#f6f6f6" : "#A3A3A3")};
  background: ${({ isActive }) => (isActive ? "var(--bg-200)" : "transparent")};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .tab-group {
    margin-left: 9px;
    font-size: 10px;
    color: ${({ isActive }) => (isActive ? "#717171" : "#545454")};
  }
`

export default EditorTab
