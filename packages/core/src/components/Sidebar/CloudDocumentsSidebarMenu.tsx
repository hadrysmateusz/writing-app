import React from "react"
import styled from "styled-components/macro"
import { Node } from "slate"
import { v4 as uuidv4 } from "uuid"

// import SidebarDocumentItem from "./SidebarDocumentItem"
import { DocumentDoc, useDatabase } from "../Database"
import ExpandableTreeItem from "../ExpandableTreeItem"
import StaticTreeItem from "../TreeItem"
import { GroupTree, GroupTreeBranch } from "../../helpers/createGroupTree"
import { useContextMenu, ContextMenuItem } from "../ContextMenu"

export const CloudDocumentsSidebarMenu: React.FC<{
  documents: DocumentDoc[]
  groups: GroupTree
  currentDocument: DocumentDoc | null
  editorContent: Node[]
  isCurrentModified: boolean
  renameDocument: (
    documentId: string,
    title: string
  ) => Promise<Document | null>
  switchEditor: (documentId: string | null) => void
  newDocument: (
    shouldSwitch: boolean,
    parentGroup: string | null
  ) => Promise<DocumentDoc | null>
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

  console.log("documents", documents)

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

      {/* {documents.map((doc) => {
        const isCurrent = !!currentDocument && currentDocument.id === doc.id
        const isModified = isCurrent && isCurrentModified
        return (
          <SidebarDocumentItem
            key={doc.id}
            document={doc}
            editorContent={editorContent}
            isCurrent={isCurrent}
            isModified={isModified}
            switchEditor={switchEditor}
            renameDocument={renameDocument}
          />
        )
      })} */}
    </List>
  )
}

const GroupTreeItem: React.FC<{
  group: GroupTreeBranch
  depth?: number
  newDocument: (
    shouldSwitch: boolean,
    parentGroup: string | null
  ) => Promise<DocumentDoc | null>
}> = ({ group, depth, newDocument }) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const db = useDatabase()

  const handleNewDocument = () => {
    newDocument(true, group.id)
  }

  const handleNewGroup = () => {
    // TODO: make it possible to actually name the group properly
    db.groups.insert({
      id: uuidv4(),
      name: Date.now() + "",
      parentGroup: null,
    })
  }

  return (
    <>
      <ExpandableTreeItem
        key={group.id}
        depth={depth}
        onContextMenu={openMenu}
        startExpanded
        childNodes={group.children.map((subgroup) => (
          <GroupTreeItem group={subgroup} newDocument={newDocument} />
        ))}
      >
        {group.name}
      </ExpandableTreeItem>{" "}
      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleNewDocument}>
            New Document
          </ContextMenuItem>
          <ContextMenuItem onClick={handleNewGroup}>
            New Collection
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
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
