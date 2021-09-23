import React, { useCallback, useMemo } from "react"
import styled, { css } from "styled-components/macro"
import { Ancestor, Node } from "slate"
import moment from "moment"

import { DocumentDoc } from "../Database"
import { EditableText } from "../RenamingInput"
import { useMainState } from "../MainProvider"
import { formatOptional } from "../../utils"
import { useDocumentContextMenu } from "../DocumentContextMenu"
// import { getGroupName } from "../../helpers/getGroupName"

const SNIPPET_LENGTH = 340

export const SidebarDocumentItem: React.FC<{
  document: DocumentDoc
  groupId?: string | null
}> = ({ document, groupId }) => {
  const {
    openMenu,
    isMenuOpen,
    DocumentContextMenu,
    getEditableProps,
  } = useDocumentContextMenu(document)
  const { /*  groups, */ currentEditor, switchDocument } = useMainState()
  const { unsyncedDocs } = useMainState()

  const isUnsynced = unsyncedDocs.includes(document.id)

  // // TODO: optimize this
  // const isInCurrentGroup = useMemo(() => {
  //   return groupId ? document.parentGroup === groupId : false
  // }, [document.parentGroup, groupId])

  const isCurrent = useMemo(() => {
    if (currentEditor === null) return false
    return document.id === currentEditor
  }, [currentEditor, document.id])

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

  // const groupName = useMemo(() => getGroupName(document.parentGroup, groups), [
  //   document.parentGroup,
  //   groups,
  // ])

  const openDocument = useCallback(() => {
    switchDocument(document.id)
  }, [document.id, switchDocument])

  const handleClick = useCallback(() => {
    // TODO: the fact that this function uses the prefetched documents list makes it impossible to preview documents in trash
    openDocument()
  }, [openDocument])

  const modifiedAt = moment(document.modifiedAt).format("LL")

  return (
    <>
      <MainContainer
        onClick={handleClick}
        onContextMenu={(e) => {
          // this is to prevent opening the sidebar context menu underneath
          // TODO: it might be better to implement a global provider for the context menu and only allow opening one and just change it's position and content
          e.stopPropagation()
          openMenu(e)
        }}
        isCurrent={isCurrent}
      >
        {/* {!isInCurrentGroup && <Group>{groupName}</Group>} */}
        <Title isUnsynced={isUnsynced}>
          <EditableText {...getEditableProps()}>{title}</EditableText>
        </Title>
        {snippet.trim().length > 0 && <Snippet>{snippet}</Snippet>}
        <DateModified>{modifiedAt}</DateModified>
        {/* TODO: add created at date */}
      </MainContainer>
      {isMenuOpen && <DocumentContextMenu />}
    </>
  )
}

const DateModified = styled.div`
  padding-top: 4px;
  color: #717171;
  font-size: 10px;
  line-height: 13px;
`

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

const Title = styled.div<{ isUnsynced: boolean }>`
  width: 100%;
  color: #e4e4e4;
  font-family: Poppins;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* ${(p) => p.isUnsynced && "color: red;"} */

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

const MainContainer = styled.div<{ isCurrent: boolean }>`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  user-select: none;
  padding: 10px 20px 12px;

  cursor: pointer;

  transition: background-color 200ms ease;

  :hover {
    background: var(--bg-highlight);
  }

  :hover ${DeleteButton} {
    opacity: 1;
  }

  ${(p) =>
    p.isCurrent &&
    css`
      background: var(--bg-highlight);
    `}
`

export default SidebarDocumentItem
