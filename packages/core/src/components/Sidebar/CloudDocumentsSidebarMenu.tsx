import React, { useState } from "react"
import styled from "styled-components/macro"
import { v4 as uuidv4 } from "uuid"

import { useDatabase } from "../Database"
import ExpandableTreeItem from "../ExpandableTreeItem"
import StaticTreeItem from "../TreeItem"

import GroupTreeItem from "./GroupTreeItem"
import { VIEWS } from "./types"
import { AllDocumentsList } from "./DocumentsList"
import { useMainState } from "../MainStateProvider"

export const CloudDocumentsSidebarMenu: React.FC<{}> = () => {
  // Can be one of the special views or an id of a document group
  const [currentView, setCurrentView] = useState<string>(VIEWS.MAIN)
  const { newDocument, groups } = useMainState()

  const db = useDatabase()

  const handleCreateDocument = async () => {
    newDocument(true, null)
  }

  switch (currentView) {
    case VIEWS.MAIN: {
      return (
        <List>
          <StaticTreeItem
            icon="cloud"
            onClick={() => setCurrentView(VIEWS.ALL)}
          >
            All Documents
          </StaticTreeItem>

          {/* <ExpandableTreeItem
            startExpanded
            icon="cloud"
            childNodes={documents.map((document) => (
              <StaticTreeItem key={document.id}>
                {document.title.trim() === "" ? "Untitled" : document.title}
              </StaticTreeItem>
            ))}
          >
            All Documents
          </ExpandableTreeItem> */}

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
    case VIEWS.ALL: {
      return <AllDocumentsList changeView={setCurrentView} />
    }
    default: {
      // TODO: treat the view as a group id and render a document list for that group
      return <button onClick={() => setCurrentView(VIEWS.MAIN)}>Back</button>
    }
  }
}

const List = styled.div`
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
