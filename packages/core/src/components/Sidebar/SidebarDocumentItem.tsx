import React, { useCallback, useState, useRef, useEffect } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"

// import { useOnClickOutside } from "../../hooks/useOnClickOutside"
import { Outline } from "./Outline"
import { DocumentDoc } from "../Database"
import { useContextMenu, ContextMenuItem } from "../ContextMenu"
import { EditableText } from "../RenamingInput"

const SidebarDocumentItem: React.FC<{
  document: DocumentDoc
  isCurrent: boolean
  isModified: boolean
  editorContent: Node[]
  renameDocument: (
    documentId: string,
    title: string
  ) => Promise<Document | null>
  switchEditor: (id: string | null) => void
}> = ({
  switchEditor,
  renameDocument,
  isCurrent,
  document,
  isModified,
  editorContent,
}) => {
  const { openMenu, closeMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const [isRenaming, setIsRenaming] = useState(false)
  const [titleValue, setTitleValue] = useState("")
  const containerRef = useRef<any>()
  const titleInputRef = useRef<any>()

  const onRename = () => {
    if (!isRenaming) return
    setIsRenaming(false)
    renameDocument(document.id, titleValue)
  }

  // TODO: replace this logic
  // useOnClickOutside(containerRef, () => {
  //   // TODO: this solution doesn't take into account other ways the menu could be closed like moving focus with tab etc. ( I could try using a simple onBlur, but that might not fire when the input is unmounted, I could try using a usePrevious hook with a useEffect to rename when they are different but that might not handle setting isRenaming state)
  //   if (isRenaming) {
  //     commitRename()
  //   }
  // })

  useEffect(() => {
    // Focus and select the input
    if (isRenaming && titleInputRef?.current) {
      console.log("focus and select")
      titleInputRef.current.focus()
      titleInputRef.current.setSelectionRange(
        0,
        titleInputRef.current.value.length
      )
    }
  }, [document.id, isRenaming, renameDocument])

  useEffect(() => {
    if (!isRenaming) {
      setTitleValue(document.title)
    }
  }, [document.title, isRenaming])

  // const handleTitleInputKeydown = (event: React.KeyboardEvent) => {
  //   if (isRenaming && isHotkey(["Enter", "Esc"], event)) {
  //     onRename()
  //   }
  // }

  const handleRenameDocument = () => {
    closeMenu()
    setIsRenaming(true)
  }

  const removeDocument = () => {
    document.remove()
    if (isCurrent) {
      switchEditor(null)
    }
  }

  const openDocument = useCallback(() => {
    switchEditor(document.id)
  }, [document.id, switchEditor])

  const title = document.title.trim() === "" ? "Untitled" : document.title

  const handleChange = (newValue: string) => {
    setTitleValue(newValue)
  }

  const handleClick = () => {
    openDocument()
  }

  return (
    <Container
      isCurrent={isCurrent}
      onContextMenu={openMenu}
      ref={containerRef}
    >
      <MainContainer>
        <EditableText
          ref={titleInputRef}
          isRenaming={isRenaming}
          value={titleValue}
          onChange={handleChange}
          onClick={handleClick}
          onRename={onRename}
          staticValue={`${title} ${isModified && " *"}`}
        />
      </MainContainer>

      {isCurrent && <Outline editorContent={editorContent} />}

      {isMenuOpen && (
        <ContextMenu>
          <ContextMenuItem onClick={handleRenameDocument}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={removeDocument}>Delete</ContextMenuItem>
        </ContextMenu>
      )}
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

const Container = styled.div<{ isCurrent: boolean }>`
  ${(p) => p.isCurrent && `font-weight: bold;`}
  padding: 5px 0;

  :hover ${DeleteButton} {
    opacity: 1;
  }
`

const MainContainer = styled.div`
  display: flex;
  align-items: center;

  .EditableText_editable {
    border: 1px solid #41474d;
    border-radius: 3px;
    padding: 3px 5px;
  }
`

export default SidebarDocumentItem
