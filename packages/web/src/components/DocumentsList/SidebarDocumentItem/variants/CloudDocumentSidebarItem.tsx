import { useCallback, useMemo } from "react"
import { Ancestor, Node } from "slate"

import { formatOptional } from "../../../../utils"

import { DocumentDoc } from "../../../Database"
import { useDocumentContextMenu } from "../../../DocumentContextMenu"
import { useTabsAPI, useTabsState } from "../../../TabsProvider"

import SidebarDocumentItemComponent from "../SidebarDocumentItemComponent"

const SNIPPET_LENGTH = 340

export const CloudDocumentSidebarItem: React.FC<{
  document: DocumentDoc
}> = ({ document }) => {
  const { openDocument } = useTabsAPI()
  const { currentCloudDocumentId } = useTabsState()

  const { openMenu, DocumentContextMenu, getEditableProps } =
    useDocumentContextMenu(document)

  const isCurrent = useMemo(() => {
    if (currentCloudDocumentId === null) return false
    return document.id === currentCloudDocumentId
  }, [currentCloudDocumentId, document.id])

  const snippet = useMemo(() => {
    // TODO: replace with a better solution that simply limits the text to some number of lines (probably with css)

    let textContent = ""

    // we get and deserialize the content of the document
    const serializedContent = document.content
    const deserializedContent = JSON.parse(serializedContent)

    // the Node.nodes function operates on a slate node but the content is an array of children so we create a fake node object
    const fakeRootNode: Ancestor = {
      children: deserializedContent,
      type: "fakeRoot",
    }

    // we iterate over all of the nodes and create a string of all of their text contents until we reach a desired length
    for (let [node] of Node.nodes(fakeRootNode, {})) {
      if ("text" in node) {
        textContent += " " + node.text

        if (textContent.length >= SNIPPET_LENGTH) {
          break
        }
      }
    }

    return textContent.slice(0, SNIPPET_LENGTH)
  }, [document.content])

  const formattedTitle = useMemo(
    () => formatOptional(document.title, "Untitled"),
    [document.title]
  )

  const handleClick = useCallback(() => {
    openDocument(document.id)
  }, [document.id, openDocument])

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
        title={formattedTitle}
        snippet={snippet}
        modifiedAt={document.modifiedAt}
        createdAt={document.createdAt}
        isCurrent={isCurrent}
        tags={document.tags}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        getEditableProps={getEditableProps}
      />
      <DocumentContextMenu />
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
