import React from "react"
import styled from "styled-components/macro"

import { useMainState } from "../MainStateProvider"
import { useViewState } from "../ViewStateProvider"
import {
  AllDocumentsList,
  DocumentsGroupList,
  TrashDocumentsList,
} from "./DocumentsList"
import { VIEWS } from "./types"

export const PrimarySidebar: React.FC<{}> = () => {
  // Can be one of the special views or an id of a document group
  const { newDocument } = useMainState()
  const { primarySidebar } = useViewState()

  const render = () => {
    switch (primarySidebar.currentView) {
      case VIEWS.ALL: {
        return (
          <Container>
            <InnerContainer>
              <AllDocumentsList />
            </InnerContainer>
            <NewButton onClick={() => newDocument(true, null)}>
              + Create New
            </NewButton>
          </Container>
        )
      }
      case VIEWS.TRASH: {
        return (
          <Container>
            <InnerContainer>
              <TrashDocumentsList />
            </InnerContainer>
          </Container>
        )
      }
      default: {
        // TODO: treat the view as a group id and render a document list for that group
        return (
          <Container>
            <InnerContainer>
              <DocumentsGroupList groupId={primarySidebar.currentView} />
            </InnerContainer>
            <NewButton
              onClick={() => newDocument(true, primarySidebar.currentView)}
            >
              + Create New
            </NewButton>
          </Container>
        )
      }
    }
  }

  return <OuterContainer>{render()}</OuterContainer>
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
  width: 280px;
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
