import { useEffect, useMemo } from "react"

import { GenericDocGroupTreeBranch } from "../../../../types"

import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  parseSidebarPath,
  SIDEBAR_VAR,
  usePrimarySidebar,
} from "../../../ViewState"
import { useLocalFS } from "../../../LocalFSProvider"
import { ContextMenuSeparator } from "../../../ContextMenu"

import {
  AddLocalPathMenuItem,
  DocumentListDisplayTypeSubmenu,
  GoUpMainHeaderButton,
  MainHeader,
  MoreMainHeaderButton,
} from "../../MainHeader"
import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"
import { NestedDocumentsList } from "../../DocumentsList"
import { LocalDocumentSectionHeader } from "../../SectionHeader"
import { LocalDocumentSidebarItem } from "../../SidebarDocumentItem"

import { findDirInTrees } from "./DirectoryView.helpers"

export const DirectoryView: React.FC = () => {
  const { currentSubviews } = usePrimarySidebar()

  // calculate this in ViewStateProvider along with other path properties
  const directoryPath = useMemo(
    () => parseSidebarPath(currentSubviews.local)?.id,
    [currentSubviews.local]
  )

  console.log("directoryPath", directoryPath)

  return directoryPath ? (
    <DirectoryViewWithFoundDirPath directoryPath={directoryPath} />
  ) : null
}

const DirectoryViewWithFoundDirPath: React.FC<{
  directoryPath: string
}> = ({ directoryPath }) => {
  const { dirTrees } = useLocalFS()
  const { switchSubview } = usePrimarySidebar()

  const dirTree = useMemo(() => {
    return findDirInTrees(dirTrees, directoryPath) as GenericDocGroupTreeBranch // TODO: find different way to ensure this type
  }, [dirTrees, directoryPath])

  // If the dir wasn't found, switch to more general sidebar view
  useEffect(() => {
    if (!dirTree) {
      switchSubview("local", "all")
    }
  }, [dirTree, switchSubview])

  // TODO: better loading/empty state + handle errors
  return dirTree ? <DirectoryViewInner dirTree={dirTree} /> : null
}

const DirectoryViewInner: React.FC<{
  dirTree: GenericDocGroupTreeBranch
}> = ({ dirTree }) => {
  const { createDocument: createFile } = useLocalFS()

  // TODO: when adding dir path to local library paths list check if it's not a descendant of a path already on the list (this would cause a shitton of problems because the dirs and files inside would no longer be unique in the tree which will probably break watchers and other things)
  // TODO: if dir has exists === false, show a warning and a button to manually find the dir
  // TODO: turn bottom button into a create local document action (and expose it in context menu)
  // TODO: move the add path action to maybe the main header (and probably context menu)

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={dirTree.name ?? "Unknown Directory"}
        numDocuments={dirTree?.childDocuments?.length}
        numSubgroups={dirTree?.childGroups?.length}
        buttons={[
          // TODO: add a way to go up one directory
          <GoUpMainHeaderButton
            goUpPath={SIDEBAR_VAR.primary.local.all}
            key={SIDEBAR_VAR.primary.local.all}
          />,

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
        {dirTree ? (
          <NestedDocumentsList
            documents={dirTree.childDocuments}
            groups={dirTree.childGroups}
            SectionHeaderComponent={LocalDocumentSectionHeader}
            DocumentItemComponent={LocalDocumentSidebarItem}
          />
        ) : null}
      </InnerContainer>

      <PrimarySidebarBottomButton
        icon="plus"
        handleClick={() => createFile(dirTree.identifier)}
      >
        Create Document
      </PrimarySidebarBottomButton>
    </PrimarySidebarViewContainer>
  )
}
