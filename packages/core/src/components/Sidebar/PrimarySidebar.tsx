import React from "react"
import styled from "styled-components/macro"

import { useViewState } from "../View/ViewStateProvider"
import {
  AllDocumentsList,
  GroupDocumentsList,
  TrashDocumentsList,
  InboxDocumentsList,
} from "../DocumentsList"
import { VIEWS } from "./types"
import { useDocumentsAPI, useMainState } from "../MainProvider"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"

export const PrimarySidebar: React.FC<{}> = () => {
  const { createDocument } = useDocumentsAPI()
  const { changeSorting } = useMainState()
  const { primarySidebar } = useViewState()
  const { openMenu, isMenuOpen, ContextMenu } = useContextMenu()

  const handleNewDocument = () => {
    let currentGroup: string | null = primarySidebar.currentView

    if ([VIEWS.ALL, VIEWS.INBOX].includes(currentGroup)) {
      currentGroup = null
    }

    createDocument(currentGroup)
  }

  const render = () => {
    switch (primarySidebar.currentView) {
      case VIEWS.ALL: {
        return (
          <Container>
            <InnerContainer onContextMenu={openMenu}>
              <AllDocumentsList />
            </InnerContainer>
            <NewButton onClick={() => createDocument(null)}>
              + Create New
            </NewButton>
            {isMenuOpen && (
              <ContextMenu>
                <ContextMenuItem onClick={handleNewDocument}>
                  New Document
                </ContextMenuItem>
              </ContextMenu>
            )}
          </Container>
        )
      }
      case VIEWS.INBOX: {
        return (
          <Container>
            <InnerContainer onContextMenu={openMenu}>
              <InboxDocumentsList />
            </InnerContainer>
            <NewButton onClick={() => createDocument(null)}>
              + Create New
            </NewButton>
            {isMenuOpen && (
              <ContextMenu>
                <ContextMenuItem onClick={handleNewDocument}>
                  New Document
                </ContextMenuItem>
              </ContextMenu>
            )}
          </Container>
        )
      }
      case VIEWS.TRASH: {
        return (
          <Container>
            <InnerContainer onContextMenu={openMenu}>
              <TrashDocumentsList />
            </InnerContainer>
          </Container>
        )
      }
      default: {
        return (
          <Container>
            <InnerContainer onContextMenu={openMenu}>
              <GroupDocumentsList groupId={primarySidebar.currentView} />
            </InnerContainer>
            <NewButton
              onClick={() => createDocument(primarySidebar.currentView)}
            >
              + Create New
            </NewButton>
            {isMenuOpen && (
              <ContextMenu>
                <ContextMenuItem onClick={handleNewDocument}>
                  New Document
                </ContextMenuItem>
              </ContextMenu>
            )}
          </Container>
        )
      }
    }
  }

  return (
    <OuterContainer>
      <div>
        <button onClick={() => changeSorting("title", "asc")}>TITLE</button>
        <button onClick={() => changeSorting("modifiedAt", "desc")}>
          MODIFIEDAT
        </button>
      </div>
      {render()}
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  min-height: 0;
  height: 100%;
  border-right: 1px solid;
  border-color: #363636;
  background-color: #1e1e1e;
  position: relative;
`

const Container = styled.div`
  min-height: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr min-content;
`

const InnerContainer = styled.div`
  overflow-y: auto;
`

const NewButton = styled.div`
  font-family: poppins;
  font-weight: 500;
  font-size: 13px;
  color: #e4e4e4;
  background: #1e1e1e;
  user-select: none;
  border-top: 1px solid #363636;
  width: 100%;
  padding: 12px 20px;
  display: block;
  cursor: pointer;
  :hover {
    color: white;
  }
`
