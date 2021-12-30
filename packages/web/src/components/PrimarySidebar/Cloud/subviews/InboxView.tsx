import { useQueryWithSorting } from "../../../../hooks"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { SIDEBAR_VAR } from "../../../ViewState"

import {
  CloudDocumentSortingSubmenu,
  DocumentListDisplayTypeSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { NewButton } from "../../PrimarySidebarBottomButton"
import { FlatDocumentsList } from "../../DocumentsList"
import { CloudDocumentSidebarItem } from "../../SidebarDocumentItem"

import { createFindDocumentsAtRootQuery } from "../queries"
import { useGenericDocumentsFromCloudDocumentsQuery } from "../hooks"

export const InboxView: React.FC = () => {
  const query = useQueryWithSorting(
    (db, sorting) => createFindDocumentsAtRootQuery(db, sorting),
    []
  )

  const [flatDocuments] = useGenericDocumentsFromCloudDocumentsQuery(query)

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="Inbox"
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
      <NewButton groupId={null} />
    </PrimarySidebarViewContainer>
  )
}
