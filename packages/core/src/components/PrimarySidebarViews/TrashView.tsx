import React from "react"

import { Container, InnerContainer } from "./Common"
import { TrashDocumentsList } from "../DocumentsList"

export const TrashView: React.FC = () => {
  return (
    <Container>
      <InnerContainer>
        <TrashDocumentsList />
      </InnerContainer>
    </Container>
  )
}