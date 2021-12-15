import React, { useMemo } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"
import createGroupTree from "../../../../helpers/createGroupTree"

import { useDatabase } from "../../../Database"
import {
  DocumentsList,
  MainHeader,
  SortingMainHeaderButton,
} from "../../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"

import { NewButton } from "../../NewButton"

import { SubGroups } from "../SubGroups"
import { createFindDocumentsAtRootQuery } from "../queries"
import { useSorting } from "../../../SortingProvider"
import { useCloudGroupsState } from "../../../CloudGroupsProvider"

export const AllDocumentsView: React.FC = () => {
  const db = useDatabase()
  const { sorting } = useSorting()
  const { groups } = useCloudGroupsState()

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsAtRootQuery(db, sorting)
  )

  const groupsTree = useMemo(() => createGroupTree(groups), [groups])

  // TODO: add a switch to toggle flat (old) view

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="All Documents"
        numDocuments={documents?.length}
        numSubgroups={groupsTree.children.length}
        buttons={[<SortingMainHeaderButton key="sorting" />]}
      />
      <InnerContainer>
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
