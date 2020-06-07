import React from "react"
import styled from "styled-components/macro"
import { Node } from "slate"
import { v4 as uuidv4 } from "uuid"

import { DocumentDoc, useDatabase } from "../Database"
import ExpandableTreeItem from "../ExpandableTreeItem"
import StaticTreeItem from "../TreeItem"
import { GroupTree } from "../../helpers/createGroupTree"
import { NewDocumentFn, RenameDocumentFn, SwitchEditorFn } from "../Main/types"
import GroupTreeItem from "./GroupTreeItem"

export const CloudDocumentsSidebarMenu: React.FC<{
  documents: DocumentDoc[]
  groups: GroupTree
  currentDocument: DocumentDoc | null
  editorContent: Node[]
  isCurrentModified: boolean
  renameDocument: RenameDocumentFn
  switchEditor: SwitchEditorFn
  newDocument: NewDocumentFn
}> = ({
  documents,
  groups,
  currentDocument,
  isCurrentModified,
  editorContent,
  renameDocument,
  switchEditor,
  newDocument,
}) => {
  // TODO: hovering toolbar and dev-tools are also using portals but from a different library - these should be unified
  const db = useDatabase()

  const handleCreateDocument = async () => {
    newDocument(true, null)
  }

  return (
    <List>
      <ExpandableTreeItem
        startExpanded
        icon="cloud"
        childNodes={documents.map((document) => (
          <StaticTreeItem key={document.id}>
            {document.title.trim() === "" ? "Untitled" : document.title}
          </StaticTreeItem>
        ))}
      >
        All Documents
      </ExpandableTreeItem>

      <ExpandableTreeItem
        startExpanded
        icon="cloud"
        childNodes={groups.map((group) => (
          <GroupTreeItem group={group} newDocument={newDocument} />
        ))}
      >
        Collections
      </ExpandableTreeItem>

      <div>
        <NewButton onClick={handleCreateDocument}>+ Create New</NewButton>
      </div>

      <button
        onClick={() => {
          db.groups.insert({
            id: uuidv4(),
            name: Date.now() + "",
            parentGroup: null,
          })
        }}
      >
        New collection
      </button>
    </List>
  )
}

const List = styled.div`
  /* padding: 0 16px; */
  font-size: 12px;
`

const NewButton = styled.div`
  user-select: none;
  background: none;
  border: none;
  padding: 16px 0;
  display: block;
  cursor: pointer;
  color: #676c72;
  :hover {
    color: #afb3b6;
  }
`
