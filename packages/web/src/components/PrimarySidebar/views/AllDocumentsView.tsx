import React, { useMemo } from "react"

import useRxSubscription from "../../../hooks/useRxSubscription"
import createGroupTree from "../../../helpers/createGroupTree"

import { useDatabase } from "../../Database"
import { useMainState } from "../../MainProvider"
import { DocumentsList, MainHeader } from "../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../SidebarCommon"

import { NewButton } from "../NewButton"

import { SubGroups } from "./SubGroups"
import { createFindDocumentsAtRootQuery } from "./queries"

export const AllDocumentsView: React.FC = () => {
  const db = useDatabase()
  const { sorting, groups } = useMainState()

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsAtRootQuery(db, sorting)
  )

  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  // TODO: add a switch to toggle flat (old) view

  return (
    <PrimarySidebarViewContainer>
      <MainHeader title="All Documents" />
      <InnerContainer groupId={null}>
        {!isLoading ? (
          <>
            <DocumentsList documents={documents || []} />
            <SubGroups groups={groupsTree.children} />
          </>
        ) : null}
      </InnerContainer>
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
