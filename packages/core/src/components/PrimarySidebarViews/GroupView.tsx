import React from "react"

import { Container, InnerContainer, NewButton } from "./Common"
import { GroupDocumentsList } from "../DocumentsList"
import { useViewState } from "../View"

export const GroupView: React.FC = () => {
  const { primarySidebar } = useViewState()

  return (
    <Container>
      <InnerContainer groupId={primarySidebar.currentView}>
        <GroupDocumentsList groupId={primarySidebar.currentView} />
      </InnerContainer>
      <NewButton groupId={primarySidebar.currentView} />
    </Container>
  )
}
