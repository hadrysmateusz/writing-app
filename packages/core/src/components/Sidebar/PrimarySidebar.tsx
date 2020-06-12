import React from "react"
import styled from "styled-components/macro"

import { useMainState } from "../MainStateProvider"
import { useViewState } from "../ViewStateProvider"
import { AllDocumentsList, DocumentsGroupList } from "./DocumentsList"
import { VIEWS } from "./types"

export const PrimarySidebar: React.FC<{}> = () => {
  // Can be one of the special views or an id of a document group
  const { newDocument } = useMainState()
  const { primarySidebar } = useViewState()

  const handleCreateDocument = async () => {
    newDocument(true, null)
  }

  const render = () => {
    switch (primarySidebar.currentView) {
      case VIEWS.ALL: {
        return (
          <div>
            <AllDocumentsList />
            <div>
              <NewButton onClick={handleCreateDocument}>+ Create New</NewButton>
            </div>
          </div>
        )
      }
      default: {
        // TODO: treat the view as a group id and render a document list for that group
        return (
          <div>
            <DocumentsGroupList groupId={primarySidebar.currentView} />
            <div>
              <NewButton onClick={handleCreateDocument}>+ Create New</NewButton>
            </div>
          </div>
        )
      }
    }
  }

  return <OuterContainer>{render()}</OuterContainer>
}

const OuterContainer = styled.div`
  border-right: 1px solid;
  border-color: #363636;
  background-color: #1e1e1e;
  position: relative;
`
const NewButton = styled.div`
  font-family: poppins;
  font-weight: 500;
  font-size: 13px;
  color: #e4e4e4;
  position: absolute;
  left: 0;
  bottom: 0;

  user-select: none;
  background: none;
  border-top: 1px solid #363636;
  width: 100%;
  padding: 12px 20px;
  display: block;
  cursor: pointer;
  :hover {
    color: white;
  }
`
