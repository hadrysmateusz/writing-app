import { useQueryWithSorting } from "../../../../hooks"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { SIDEBAR_VAR } from "../../../ViewState"
import { useDocumentsAPI } from "../../../CloudDocumentsProvider"

import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { FlatDocumentsList } from "../../DocumentsList"
import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"
import { CloudDocumentSidebarItem } from "../../SidebarDocumentItem"

import { createFindDeletedDocumentsQuery } from "../queries"
import { useGenericDocumentsFromCloudDocumentsQuery } from "../hooks"

export const TrashView: React.FC = () => {
  const query = useQueryWithSorting(
    (db, sorting) => createFindDeletedDocumentsQuery(db, sorting),
    []
  )

  const [flatDocuments] = useGenericDocumentsFromCloudDocumentsQuery(query)

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="Trash"
        numDocuments={flatDocuments.length}
        buttons={[
          <GoUpMainHeaderButton
            goUpPath={SIDEBAR_VAR.primary.cloud.all}
            key={SIDEBAR_VAR.primary.cloud.all}
          />,
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
        <FlatDocumentsList
          documents={flatDocuments}
          DocumentItemComponent={CloudDocumentSidebarItem}
        />
      </InnerContainer>
      <DeleteAllButton />
    </PrimarySidebarViewContainer>
  )
}

const DeleteAllButton: React.FC = () => {
  const { permanentlyRemoveAllDocuments } = useDocumentsAPI()

  return (
    <PrimarySidebarBottomButton
      icon="trash"
      handleClick={() => permanentlyRemoveAllDocuments()}
    >
      Empty Trash
    </PrimarySidebarBottomButton>
  )
}
