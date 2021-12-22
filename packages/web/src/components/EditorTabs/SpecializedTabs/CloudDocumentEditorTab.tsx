import React, { useState, useEffect } from "react"

import { formatOptional } from "../../../utils"
import { useRxSubscription } from "../../../hooks"

import { useDocumentContextMenu } from "../../DocumentContextMenu"
import { EditableText } from "../../RenamingInput"
import { DocumentDoc, useDatabase } from "../../Database"
import Icon from "../../Icon"
import { useTabsAPI } from "../../TabsProvider"

import { EditorTabContainer } from "../EditorTab.styles"
import { TabCloseButton } from "../EditorTabCommon"
import { useCloudGroupsAPI } from "../../CloudGroupsProvider"

const initialTabData = { title: "", group: null }

export const CloudDocumentEditorTab: React.FC<{
  tabId: string
  documentId: string
  isActive: boolean
  keep: boolean
  handleSwitchTab: (e: React.MouseEvent) => void
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ tabId, documentId, ...rest }) => {
  const db = useDatabase()
  const { closeTab } = useTabsAPI()

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
  const { findGroupById } = useCloudGroupsAPI()

  const [tabData, setTabData] = useState<{
    title: string
    group: string | null
  }>(initialTabData)

  const {
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
    getContainerProps,
    getContextMenuProps,
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
      <div className="tab-icon">
        <Icon icon="cloud" />
      </div>
      <div className="tab-title">
        <EditableText {...getEditableProps()}>{tabData.title}</EditableText>
      </div>
      {tabData.group ? <div className="tab-group">{tabData.group}</div> : null}
      <TabCloseButton handleCloseTab={handleCloseTab} />
      {isMenuOpen ? <DocumentContextMenu {...getContextMenuProps()} /> : null}
    </EditorTabContainer>
  )
}
