import { useEffect, useMemo } from "react"

import {
  fillGenericGroupTreeWithDocuments,
  getAllGroupIdsInGenericTree,
} from "../../../../helpers"
import { useQueryWithSorting } from "../../../../hooks"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  parseSidebarPath,
  SIDEBAR_VAR,
  usePrimarySidebar,
} from "../../../ViewState"

import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
  useGoUpPath,
} from "../../MainHeader"
import { NewButton } from "../../PrimarySidebarBottomButton"
import { CloudDocumentSectionHeader } from "../../SectionHeader"
import { DocumentsList } from "../../DocumentsList"
import { CloudDocumentSidebarItem } from "../../SidebarDocumentItem"

import {
  useGenericDocumentsFromCloudDocumentsQuery,
  useGenericGroupTreeFromCloudGroups,
} from "../hooks"
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
  const { switchSubview } = usePrimarySidebar()

  const { group, childGroups } = useFindGroupAndChildGroups(groupId)

  const ok = !!group && !!childGroups

  // If the group wasn't found, switch to more general sidebar view
  useEffect(() => {
    if (!ok) {
      switchSubview("cloud", "all")
    }
  }, [ok, switchSubview])

  // =======================================================================

  const genericGroupTree = useGenericGroupTreeFromCloudGroups(groupId)

  const groupIdsForQuery = useMemo(
    () => getAllGroupIdsInGenericTree(genericGroupTree),
    [genericGroupTree]
  )

  const query = useQueryWithSorting(
    (db, sorting) =>
      db.documents
        .findNotRemoved()
        .where("parentGroup")
        .in(groupIdsForQuery)
        .sort({ [sorting.index]: sorting.direction }),
    [groupIdsForQuery]
  )

  const [flatDocuments] = useGenericDocumentsFromCloudDocumentsQuery(query)

  const filledGroupTree = useMemo(
    () => fillGenericGroupTreeWithDocuments(genericGroupTree, flatDocuments),
    [flatDocuments, genericGroupTree]
  )

  // =======================================================================

  const goUpPath = useGoUpPath(
    filledGroupTree,
    SIDEBAR_VAR.primary.cloud.group,
    SIDEBAR_VAR.primary.cloud.all
  )

  return filledGroupTree ? (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={
          filledGroupTree.identifier
            ? filledGroupTree.name
            : "Unnamed Collection"
        }
        numDocuments={filledGroupTree?.childDocuments?.length}
        numSubgroups={filledGroupTree?.childGroups?.length}
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
        <DocumentsList
          groupTree={filledGroupTree}
          flatDocumentsList={flatDocuments}
          SectionHeaderComponent={CloudDocumentSectionHeader}
          DocumentItemComponent={CloudDocumentSidebarItem}
        />
      </InnerContainer>

      <NewButton groupId={groupId} />
    </PrimarySidebarViewContainer>
  ) : null
}
