import { useCallback, useMemo } from "react"

import { formatOptional } from "../../../../utils"

import { useCloudGroupsState } from "../../../CloudGroupsProvider"
import { useDocumentContextMenu } from "../../../DocumentContextMenu"
import { useTabsAPI, useTabsState } from "../../../TabsProvider"
import { usePrimarySidebar } from "../../../ViewState"

import SidebarDocumentItemComponent from "../SidebarDocumentItemComponent"
import { SidebarDocumentItemProps } from "../types"
import { useDocumentSnippet } from "../hooks"

export const CloudDocumentSidebarItem: React.FC<SidebarDocumentItemProps> = ({
  document,
}) => {
  const { documentsListDisplayType } = usePrimarySidebar()
  const { openDocument } = useTabsAPI()
  const { currentCloudDocumentId } = useTabsState()
  const { groups } = useCloudGroupsState() // TODO: move the groupName related logic to separate component to decouple this from groups changes when not needed

  const groupName = useMemo(() => {
    const foundGroup = groups.find(
      (group) => group.id === document.parentIdentifier
    )
    return foundGroup?.name
  }, [document.parentIdentifier, groups])

  const {
    openMenu,
    getEditableProps,
    getContextMenuProps,
    DocumentContextMenu,
    isMenuOpen,
  } = useDocumentContextMenu(document)

  const isCurrent = useMemo(() => {
    if (currentCloudDocumentId === null) return false
    return document.identifier === currentCloudDocumentId
  }, [currentCloudDocumentId, document.identifier])

  const snippet = useDocumentSnippet(document.content)

  const formattedTitle = useMemo(
    () => formatOptional(document.name, "Untitled"),
    [document.name]
  )

  const handleClick = useCallback(() => {
    openDocument(document.identifier)
  }, [document.identifier, openDocument])

  const handleContextMenu = useCallback(
    (e) => {
      // this is to prevent opening the sidebar context menu underneath
      // TODO: it might be better to implement a global provider for the context menu and only allow opening one and just change it's position and content
      e.stopPropagation()
      openMenu(e)
    },
    [openMenu]
  )

  return (
    <>
      <SidebarDocumentItemComponent
        listType={documentsListDisplayType}
        title={formattedTitle}
        snippet={snippet}
        modifiedAt={document.modifiedAt}
        createdAt={document.createdAt}
        isCurrent={isCurrent}
        tags={document.tags}
        groupName={groupName}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        getEditableProps={getEditableProps}
      />
      {isMenuOpen ? <DocumentContextMenu {...getContextMenuProps()} /> : null}
    </>
  )
}

export default CloudDocumentSidebarItem

// <MainContainer
// onClick={handleClick}
// onContextMenu={(e) => {
//   // this is to prevent opening the sidebar context menu underneath
//   // TODO: it might be better to implement a global provider for the context menu and only allow opening one and just change it's position and content
//   e.stopPropagation()
//   openMenu(e)
// }}
// isCurrent={isCurrent}
// >
// <Title isUnsynced={/* isUnsynced */ false}>
//   <EditableText {...getEditableProps()}>{title}</EditableText>
// </Title>
// {snippet.trim().length > 0 && <Snippet>{snippet}</Snippet>}
// <DateModified
//   title={`Modified at: ${modifiedAt}\nCreated at: ${createdAt}`}
// >
//   {modifiedAt}
// </DateModified>
// </MainContainer>
