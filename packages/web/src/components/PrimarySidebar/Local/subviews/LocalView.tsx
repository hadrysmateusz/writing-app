import {
  AddLocalPathMenuItem,
  DocumentListDisplayTypeSubmenu,
  MainHeader,
  MoreMainHeaderButton,
} from "../../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { useLocalFS } from "../../../LocalFSProvider"
import { ContextMenuSeparator } from "../../../ContextMenu"

import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

import { DirItem } from "../DirItem"

// TODO: rename to localdocumentsallview
export const LocalView: React.FC<{}> = () => {
  // TODO:  loading/empty state + handle errors
  const { dirTrees, createDocument } = useLocalFS()

  // TODO: if dir has exists === false, show a warning and a button to manually find the dir
  // TODO: add local document context menu
  // TODO: turn bottom button into a create local document action (and expose it in context menu)
  // TODO: move the add path action to maybe the main header (and probably context menu)
  // TODO: refactor and generalize group tree items to support library dirs (and display them instead of collections when local documents are the selected view (also hide tags then (maybe change the entire navigator sidebar to support the local view then (e.g. add recent docs section instead of favorites))))

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title="Local"
        buttons={[
          <MoreMainHeaderButton
            key="sorting"
            contextMenuContent={
              <>
                {/* <CloudDocumentSortingSubmenu /> // TODO: support sorting for local directories */}
                <DocumentListDisplayTypeSubmenu />
                <ContextMenuSeparator />
                <AddLocalPathMenuItem />
              </>
            }
          />,
        ]}
      />
      <InnerContainer>
        {dirTrees.map((dirTree) => (
          <DirItem key={dirTree.path} dir={dirTree} startOpen={true} />
        ))}
      </InnerContainer>

      <PrimarySidebarBottomButton
        icon="plus"
        handleClick={
          () => createDocument() // TODO: this
        }
      >
        Create Document
      </PrimarySidebarBottomButton>
    </PrimarySidebarViewContainer>
  )
}
