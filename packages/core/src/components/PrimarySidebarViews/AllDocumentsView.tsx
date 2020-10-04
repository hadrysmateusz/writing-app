import React from "react"

import { Container, InnerContainer, NewButton } from "./Common"
import { AllDocumentsList } from "../DocumentsList"

export const AllDocumentsView: React.FC = () => {
  return (
    <Container>
      <InnerContainer groupId={null}>
        <AllDocumentsList />
      </InnerContainer>
      <NewButton groupId={null} />
    </Container>
  )
}
