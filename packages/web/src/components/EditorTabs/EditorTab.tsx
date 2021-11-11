import styled from "styled-components/macro"
import { useState, useEffect, FC, useCallback } from "react"

import { useDatabase } from "../Database"
import { useGroupsAPI, useMainState, useTabsState } from "../MainProvider"
import Icon from "../Icon"

import { formatOptional } from "../../utils"
import { ellipsis } from "../../style-utils"

const initialTabData = { title: "", group: null }

const EditorTab: FC<{ tabId: string; isOnlyTab?: boolean }> = ({
  tabId,
  isOnlyTab = false,
}) => {
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
      {/* TODO: not sure if not showing the close button is the best solution but it's better than nothing (I could remove this when/if I add different tab types and the placeholder tab type so that a new document isn't created every time, even when nothing is written in the new tab) */}
      {!isOnlyTab ? (
        <div
          className="tab-close-button"
          onClick={(e) => {
            e.stopPropagation()
            closeTab(tabId)
          }}
        >
          <Icon icon="close" />
        </div>
      ) : null}
    </EditorTabContainer>
  )
}

const EditorTabContainer = styled.div<{ isActive?: boolean }>`
  --bg-color-default: var(--bg-100);
  --bg-color-active: var(--bg-200);
  --bg-color: ${({ isActive }) =>
    isActive ? "var(--bg-color-active)" : "var(--bg-color-default)"};

  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
  height: var(--tab-size);
  padding: 0 16px;
  font-size: 12px;
  color: ${({ isActive }) =>
    isActive ? "var(--light-600)" : "var(--light-300)"};
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  max-width: 800px;
  min-width: ${({ isActive }) => (isActive ? "fit-content" : "0")};

  .tab-title {
    flex-shrink: 1;
    ${ellipsis}
  }

  .tab-group {
    flex-shrink: 5;
    margin-left: 9px;
    font-size: 10px;
    color: var(--light-100);
    ${ellipsis}
  }

  .tab-close-button {
    position: absolute;
    right: 0;

    margin: 4px 5px;
    padding: 3px;
    border-radius: 3px;

    background: ${({ isActive }) =>
      isActive ? "var(--bg-200)" : "var(--bg-100)"};
    opacity: 0;

    font-size: 14px;

    color: var(--light-100);
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
