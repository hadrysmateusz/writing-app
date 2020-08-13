import React, { useCallback, useMemo } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"

import { DocumentDoc } from "../Database"
import { EditableText } from "../RenamingInput"
import { useMainState } from "../MainProvider"
import { formatOptional } from "../../utils"
import { useDocumentContextMenu } from "../DocumentContextMenu"
import { GroupTreeBranch } from "../../helpers/createGroupTree"
import { getGroupName } from "../../helpers/getGroupName"

const SNIPPET_LENGTH = 340

const SidebarDocumentItem: React.FC<{
  document: DocumentDoc
  group?: GroupTreeBranch | string
}> = ({ document, group }) => {
  const {
    openMenu,
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
  } = useDocumentContextMenu(document)
  const { groups, currentDocument, switchDocument } = useMainState()

  // TODO: optimize this
  const isInCurrentGroup = useMemo(() => {
    if (typeof group === "string") {
      return document.parentGroup === group
    } else {
      return group ? document.parentGroup === group.id : false
    }
  }, [document.parentGroup, group])

  const isCurrent = useMemo(() => {
    // TODO: something doesn't work here
    if (currentDocument === null) return false
    return document.id === currentDocument.id
  }, [currentDocument, document.id])

  const title = useMemo(() => formatOptional(document.title, "Untitled"), [
    document.title,
  ])

  const snippet = useMemo(() => {
    // TODO: replace with a better solution that simply limits the text to some number of lines (probably with css)

    let textContent = ""

    // we get and deserialize the content of the document
    const serializedContent = document.content
    const deserializedContent = JSON.parse(serializedContent)

    // the Node.nodes function operates on a slate node but the content is an array of children so we create a fake node object
    const fakeRootNode = {
      children: deserializedContent,
    }

    // we iterate over all of the nodes and create a string of all of their text contents until we reach a desired length
    for (let [node] of Node.nodes(fakeRootNode, {})) {
      if (typeof node.text === "string") {
        textContent += " " + node.text

        if (textContent.length >= SNIPPET_LENGTH) {
          break
        }
      }
    }

    return textContent.slice(0, SNIPPET_LENGTH)
  }, [document.content])

  const groupName = useMemo(() => getGroupName(document.parentGroup, groups), [
    document.parentGroup,
    groups,
  ])

  const openDocument = useCallback(() => {
    switchDocument(document.id)
  }, [document.id, switchDocument])

  const handleClick = useCallback(() => {
    // TODO: the fact that this function uses the prefetched documents list makes it impossible to preview documents in trash
    openDocument()
  }, [openDocument])

  return (
    <Container
      onContextMenu={(e) => {
        // this is to prevent opening the sidebar context menu underneath
        // TODO: it might be better to implement a global provider for the context menu and only allow opening one and just change it's position and content
        e.stopPropagation()
        openMenu(e)
      }}
    >
      <MainContainer onClick={handleClick} isCurrent={isCurrent}>
        {!isInCurrentGroup && <Group>{groupName}</Group>}
        <Title>
          <EditableText {...getEditableProps()}>{title}</EditableText>
        </Title>
        {snippet.trim().length > 0 && <Snippet>{snippet}</Snippet>}
        {/* TODO: add created at date */}
      </MainContainer>
      {isMenuOpen && <DocumentContextMenu />}
    </Container>
  )
}

const DeleteButton = styled.div`
  cursor: pointer;
  opacity: 0;
  font-size: 11px;
  color: #afb3b6;
  padding: 8px;
  margin-right: -8px;
  :hover {
    color: white;
    font-weight: bold;
  }
`

const Group = styled.div`
  font-size: 10px;
  line-height: 16px;
  text-transform: uppercase;
  font-weight: 500;
  color: #717171;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`

const Title = styled.div`
  width: 100%;
  color: #e4e4e4;
  font-family: Poppins;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .EditableText_editable {
    padding: 1px 2px 0;
  }
`

const Snippet = styled.div`
  --line-height: 16px;
  line-height: var(--line-height);
  max-height: calc(2 * var(--line-height));
  overflow: hidden;

  /* TODO: improve these styles */
  overflow-wrap: break-word;
  line-break: anywhere;
  line-clamp: 2;

  color: #bebebe;
  font-size: 11px;
  padding-top: 1px;
`

const Container = styled.div`
  width: 100%;

  :hover ${DeleteButton} {
    opacity: 1;
  }
`

const MainContainer = styled.div<{ isCurrent: boolean }>`
  user-select: none;
  max-width: 100%;
  overflow: hidden;
  min-width: 0;
  padding: 10px 20px 12px;
  border-bottom: 1px solid;
  border-color: #363636;
  cursor: pointer;

  animation: background-color 200ms ease;

  ${(p) => p.isCurrent && "background-color: #252525;"}

  :hover {
    background-color: #252525;
  }
`

export default SidebarDocumentItem
