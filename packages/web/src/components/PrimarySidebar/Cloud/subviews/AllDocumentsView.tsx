import { useMemo } from "react"

import { useQueryWithSorting } from "../../../../hooks"
import { fillGenericGroupTreeWithDocuments } from "../../../../helpers"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"

import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { NewButton } from "../../PrimarySidebarBottomButton"

import {
  useGenericDocumentsFromCloudDocumentsQuery,
  useGenericGroupTreeFromCloudGroups,
} from "../hooks"
import { DocumentsList } from "../GenericCloudDocumentsList"

export const AllDocumentsView: React.FC = () => {
  const genericGroupTree = useGenericGroupTreeFromCloudGroups(null)

  const query = useQueryWithSorting(
    (db, sorting) =>
      db.documents
        .findNotRemoved()
        .sort({ [sorting.index]: sorting.direction }),
    []
  )

  const [flatDocuments] = useGenericDocumentsFromCloudDocumentsQuery(query)

  const filledGroupTree = useMemo(
    () => fillGenericGroupTreeWithDocuments(genericGroupTree, flatDocuments),
    [flatDocuments, genericGroupTree]
  )

  return filledGroupTree ? (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="All Documents"
        numDocuments={filledGroupTree?.childDocuments?.length}
        numSubgroups={filledGroupTree?.childGroups?.length}
        buttons={[
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
        />
      </InnerContainer>

      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  ) : null
}
