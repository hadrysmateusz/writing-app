import { useState, useEffect, FC, useCallback } from "react"
import styled from "styled-components/macro"

import { useDatabase } from "../Database"
import { useGroupsAPI, useMainState, useTabsState } from "../MainProvider"
import { formatOptional } from "../../utils"
import Icon from "../Icon"

const initialTabData = { title: "", group: null }

const EditorTab: FC<{ tabId: string }> = ({ tabId }) => {
  const db = useDatabase()
  const tabsState = useTabsState()
  const { findGroupById } = useGroupsAPI()
  const { openDocument, closeTab } = useMainState()

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
        closeTab(tabId)
        // TODO: handle this more gracefully
        // throw new Error("Document not found")
        return
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
  }, [closeTab, db.documents, findGroupById, tab.documentId, tabId])

  const handleClick = useCallback(() => {
    if (isActive) {
      return
    }
    openDocument(tab.documentId)
  }, [isActive, openDocument, tab.documentId])

  return (
    <EditorTabContainer isActive={isActive} onClick={handleClick}>
      <div className="tab-title">{tabData.title}</div>
      {tabData.group ? <div className="tab-group">{tabData.group}</div> : null}
      <div
        className="tab-close-button"
        onClick={(e) => {
          e.stopPropagation()
          closeTab(tabId)
        }}
      >
        <Icon icon="close" />
      </div>
    </EditorTabContainer>
  )
}

const EditorTabContainer = styled.div<{ isActive: boolean }>`
  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
  height: var(--tab-size);
  padding: 0 16px;
  font-size: 12px;
  color: ${({ isActive }) => (isActive ? "#f6f6f6" : "#A3A3A3")};
  background: ${({ isActive }) => (isActive ? "var(--bg-200)" : "#131313")};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  .tab-group {
    margin-left: 9px;
    font-size: 10px;
    color: ${({ isActive }) => (isActive ? "#717171" : "#545454")};
  }

  .tab-close-button {
    position: absolute;
    right: 0;

    margin: 4px 5px;
    padding: 3px;
    border-radius: 3px;

    background: ${({ isActive }) => (isActive ? "var(--bg-200)" : "#131313")};
    opacity: 0;

    font-size: 14px;
    color: #7d7d7d;
    &:hover {
      color: white;
    }
  }

  &:hover {
    .tab-close-button {
      opacity: 1;
    }
  }
`

export default EditorTab
