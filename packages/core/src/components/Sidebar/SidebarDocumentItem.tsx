import React, { useCallback, useMemo } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"

import { DocumentDoc } from "../Database"
import { EditableText } from "../RenamingInput"
import { useMainState } from "../MainStateProvider"
import { formatOptional } from "../../utils"
import { useDocumentContextMenu } from "../DocumentContextMenu"

const SNIPPET_LENGTH = 80

const SidebarDocumentItem: React.FC<{
  document: DocumentDoc
}> = ({ document }) => {
  const {
    openMenu,
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
  } = useDocumentContextMenu(document)
  const { groups, currentDocument, switchDocument } = useMainState()

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

  const groupName = useMemo(() => {
    if (document.parentGroup === null) {
      // TODO: better handle documents at the root of the tree
      return null
    }

    const group = groups.find((group) => group.id === document.parentGroup)

    if (group === undefined) {
      throw new Error(`couldn't find group with id: ${document.parentGroup}`)
    }

    return group.name
  }, [document.parentGroup, groups])

  const openDocument = useCallback(() => {
    switchDocument(document.id)
  }, [document.id, switchDocument])

  const handleClick = useCallback(() => {
    openDocument()
  }, [openDocument])

  return (
    <Container onContextMenu={openMenu}>
      <MainContainer onClick={handleClick} isCurrent={isCurrent}>
        <Group>{groupName}</Group>
        <Title>
          <EditableText {...getEditableProps()}>{title}</EditableText>
        </Title>
        {snippet.trim().length > 0 && <Snippet>{snippet}</Snippet>}
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
  text-transform: uppercase;
  font-weight: 500;
  color: #717171;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Title = styled.div`
  width: 100%;
  color: #e4e4e4;
  font-family: Poppins;
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Snippet = styled.div`
  color: #bebebe;
  font-size: 11px;
  padding-bottom: 4px;

  /* TODO: improve these styles */
  overflow-wrap: break-word;
  line-break: anywhere;
  line-clamp: 2;
`

const Container = styled.div`
  width: 100%;

  :hover ${DeleteButton} {
    opacity: 1;
  }
`

const MainContainer = styled.div<{ isCurrent: boolean }>`
  max-width: 100%;
  overflow: hidden;
  min-width: 0;
  padding: 10px 20px;
  border-bottom: 1px solid;
  border-color: #363636;
  cursor: pointer;

  animation: background-color 200ms ease;

  ${(p) => p.isCurrent && "background-color: #252525;"}

  :hover {
    background-color: #252525;
  }

  .EditableText_editable {
    border: 1px solid #41474d;
    border-radius: 3px;
    padding: 3px 5px;
  }
`

export default SidebarDocumentItem
