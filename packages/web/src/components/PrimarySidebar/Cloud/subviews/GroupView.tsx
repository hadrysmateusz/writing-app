import React, { useEffect, useMemo } from "react"

import useRxSubscription from "../../../../hooks/useRxSubscription"
import { formatOptional } from "../../../../utils"

import { useDatabase } from "../../../Database"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  parseSidebarPath,
  SIDEBAR_VAR,
  usePrimarySidebar,
} from "../../../ViewState"
import { useSorting } from "../../../SortingProvider"

import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { NewButton } from "../../PrimarySidebarBottomButton"

import { CloudDocumentsListAndSubGroups } from "../SubGroups"
import { createFindDocumentsInGroupQuery } from "../queries"
import { useFindGroupAndChildGroups } from "../helpers"

export const GroupView: React.FC = () => {
  const { currentSubviews } = usePrimarySidebar()

  // calculate this in ViewStateProvider along with other path properties
  const groupId = useMemo(
    () => parseSidebarPath(currentSubviews.cloud)?.id,
    [currentSubviews.cloud]
  )

  console.log("groupId", groupId)

  return groupId ? <GroupViewWithFoundGroupId groupId={groupId} /> : null
}

const GroupViewWithFoundGroupId: React.FC<{ groupId: string }> = ({
  groupId,
}) => {
  const db = useDatabase()
  const { switchSubview } = usePrimarySidebar()
  const { sorting } = useSorting()

  const { group, childGroups } = useFindGroupAndChildGroups(groupId)

  const ok = !!group && !!childGroups

  // If the group wasn't found, switch to more general sidebar view
  useEffect(() => {
    if (!ok) {
      switchSubview("cloud", "all")
    }
  }, [ok, switchSubview])

  const { data: documents, isLoading } = useRxSubscription(
    createFindDocumentsInGroupQuery(db, sorting, groupId)
  )

  const goUpPath = group?.parentGroup
    ? `${SIDEBAR_VAR.primary.cloud.group}_${group.parentGroup}`
    : SIDEBAR_VAR.primary.cloud.all

  // TODO: support flat view (probably recursively fetch all nested groups and use a query that matches any of those gorupIds)
  return ok ? (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={formatOptional(group.name, "Unnamed Collection")}
        numDocuments={documents?.length}
        numSubgroups={childGroups.length}
        buttons={[
          <GoUpMainHeaderButton goUpPath={goUpPath} key={goUpPath} />,
          <MoreMainHeaderButton
            key="sorting"
            contextMenuContent={
              <>
                <CloudDocumentSortingSubmenu />
                <DocumentListDisplayTypeSubmenu />
              </>
            }
          />,
        ]}
      />
      <InnerContainer>
        {!isLoading ? (
          <CloudDocumentsListAndSubGroups
            documents={documents || []}
            groups={group.children}
            listType="nested_list"
          />
        ) : null}
      </InnerContainer>
      <NewButton groupId={groupId} />
    </PrimarySidebarViewContainer>
  ) : null
}
