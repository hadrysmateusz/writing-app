import React from "react"

import { Container, InnerContainer, NewButton } from "./Common"
import { InboxDocumentsList } from "../DocumentsList"

export const InboxView: React.FC = () => {
  return (
    <Container>
      <InnerContainer groupId={null}>
        <InboxDocumentsList />
      </InnerContainer>
      <NewButton groupId={null} />
    </Container>
  )
}
