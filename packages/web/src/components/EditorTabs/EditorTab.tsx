import styled from "styled-components/macro"
import React, { useState, useEffect, FC, useMemo } from "react"

import { DocumentDoc, useDatabase } from "../Database"
import { useGroupsAPI, useMainState, useTabsState } from "../MainProvider"
import Icon from "../Icon"

import { formatOptional } from "../../utils"
import { ellipsis } from "../../style-utils"
import { useRxSubscription } from "../../hooks"
import { useDocumentContextMenu } from "../DocumentContextMenu"
import { EditableText } from "../RenamingInput"

const initialTabData = { title: "", group: null }

const EditorTab: FC<{ tabId: string }> = ({ tabId }) => {
  const tabsState = useTabsState()
  const { closeTab, tabsDispatch } = useMainState()

  const isActive = tabsState.currentTab === tabId
  const tab = useMemo(() => tabsState.tabs[tabId], [tabId, tabsState.tabs])

  const handleSwitchTab = (_e: React.MouseEvent) => {
    if (isActive) {
      return
    }
    tabsDispatch({ type: "switch-tab", tabId })
  }

  const handleCloseTab = (e: React.MouseEvent) => {
    e.stopPropagation()
    closeTab(tab.tabId)
  }

  const renderTab = () => {
    switch (tab.tabType) {
      case "cloudDocument": {
        return (
          <CloudDocumentEditorTab
            tabId={tab.tabId}
            documentId={tab.documentId}
            isActive={isActive}
            keep={tab.keep}
            handleSwitchTab={handleSwitchTab}
            handleCloseTab={handleCloseTab}
          />
        )
      }
      case "cloudNew": {
        return (
          <CloudNewEditorTab
            isActive={isActive}
            keep={tab.keep}
            handleSwitchTab={handleSwitchTab}
            handleCloseTab={handleCloseTab}
          />
        )
      }
      case "localDocument": {
        // TODO: local document tabs
        return null
      }
    }
  }

  return renderTab()
}

const CloudDocumentEditorTab: React.FC<{
  tabId: string
  documentId: string
  isActive: boolean
  keep: boolean
  handleSwitchTab: (e: React.MouseEvent) => void
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ tabId, documentId, ...rest }) => {
  const db = useDatabase()
  const { closeTab } = useMainState()

  const { data: document, isLoading: isDocumentLoading } = useRxSubscription(
    db.documents.findOne(documentId)
  )

  useEffect(() => {
    // Document wasn't found (tab probably has an invalid id, so we close it)
    if (!document && !isDocumentLoading) {
      closeTab(tabId)
      // TODO: handle this more gracefully
      // throw new Error("Document not found")
    }
  }, [closeTab, document, isDocumentLoading, tabId])

  return !!document ? (
    <CloudDocumentEditorTabWithFoundDocument document={document} {...rest} />
  ) : null
}

const CloudDocumentEditorTabWithFoundDocument: React.FC<{
  document: DocumentDoc
  isActive: boolean
  keep: boolean
  handleSwitchTab: (e: React.MouseEvent) => void
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ document, isActive, keep, handleSwitchTab, handleCloseTab }) => {
  const { findGroupById } = useGroupsAPI()

  const [tabData, setTabData] = useState<{
    title: string
    group: string | null
  }>(initialTabData)

  const {
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
    getContainerProps,
  } = useDocumentContextMenu(document)

  useEffect(() => {
    const title = formatOptional(document.title, "Untitled")

    // Document has no parent group (is at root)
    if (!document?.parentGroup) {
      setTabData({
        title: title,
        group: "",
      })
    } else {
      // Document has a parent group, so we find its name
      findGroupById(document.parentGroup).then((group) => {
        setTabData({
          title: title,
          group: group.name,
        })
      })
    }
  }, [document.parentGroup, document.title, findGroupById])

  return (
    <EditorTabContainer
      isActive={isActive}
      keep={keep}
      onClick={handleSwitchTab}
      {...getContainerProps()}
    >
      <div className="tab-title">
        <EditableText {...getEditableProps()}>{tabData.title}</EditableText>
      </div>
      {tabData.group ? <div className="tab-group">{tabData.group}</div> : null}
      <TabCloseButton handleCloseTab={handleCloseTab} />
      {isMenuOpen && <DocumentContextMenu />}
    </EditorTabContainer>
  )
}

const CloudNewEditorTab: React.FC<{
  isActive: boolean
  keep: boolean
  handleSwitchTab: (e: React.MouseEvent) => void
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ isActive, keep, handleSwitchTab, handleCloseTab }) => {
  return (
    <EditorTabContainer
      isActive={isActive}
      keep={keep}
      onClick={handleSwitchTab}
    >
      <div className="tab-title">Untitled</div>
      <TabCloseButton handleCloseTab={handleCloseTab} />
    </EditorTabContainer>
  )
}

const TabCloseButton: React.FC<{
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ handleCloseTab }) => {
  /* TODO: not sure if not showing the close button is the best solution but it's better than nothing (I could remove this when/if I add different tab types and the placeholder tab type so that a new document isn't created every time, even when nothing is written in the new tab) */
  return (
    <div className="tab-close-button" onClick={handleCloseTab}>
      <Icon icon="close" />
    </div>
  )
}

const EditorTabContainer = styled.div<{ isActive?: boolean; keep: boolean }>`
  --bg-color-default: var(--bg-100);
  --bg-color-active: var(--bg-200);
  --bg-color: ${({ isActive }) =>
    isActive ? "var(--bg-color-active)" : "var(--bg-color-default)"};

  ${(p) => (!p.keep ? "font-style: italic;" : null)}

  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
  height: var(--tab-size);
  padding: 0 16px;
  font-size: 12px;

  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  max-width: 800px;
  min-width: ${({ isActive }) => (isActive ? "fit-content" : "0")};

  .tab-title {
    color: ${({ isActive }) =>
      isActive ? "var(--light-600)" : "var(--light-300)"};
    flex-shrink: 1;
    ${ellipsis}
  }

  .tab-group {
    flex-shrink: 5;
    margin-left: 9px;
    font-size: 10px;
    color: ${({ isActive }) =>
      isActive ? "var(--light-200)" : "var(--light-100)"};
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
    .tab-title {
      color: ${({ isActive }) =>
        isActive ? "var(--light-600)" : "var(--light-400)"};
    }
    .tab-group {
      color: ${({ isActive }) =>
        isActive ? "var(--light-200)" : "var(--light-200)"};
    }
  }
`

export default EditorTab
