import React from "react"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"
import { TrashDocumentsList } from "../../DocumentsList"

export const TrashView: React.FC = () => {
  return (
    <PrimarySidebarViewContainer>
      <InnerContainer groupId={undefined}>
        <TrashDocumentsList />
      </InnerContainer>
    </PrimarySidebarViewContainer>
  )
}
