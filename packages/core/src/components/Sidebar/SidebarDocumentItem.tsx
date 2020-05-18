import React, { useCallback, useEffect, useState } from "react"
// import { DataStore } from "aws-amplify"
import styled from "styled-components"

import { DocumentDoc } from "../Database"
import { Node } from "slate"

const SidebarDocumentItem: React.FC<{
  document: DocumentDoc
  isCurrent: boolean
  isModified: boolean
  editorContent: Node[]
  switchEditor: (id: string | null) => void
}> = ({ document, switchEditor, isCurrent, isModified, editorContent }) => {
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

  return (
    <Container isCurrent={isCurrent}>
      <MainContainer>
        <Title onClick={openDocument}>
          {title} {isModified && " *"}
        </Title>
        <DeleteButton onClick={removeDocument}>X</DeleteButton>
      </MainContainer>
      {isCurrent && <Outline editorContent={editorContent} />}
    </Container>
  )
}

const OUTLINE_HEADING_MAX_LENGTH = 40 // TODO: this might need to change to fit a resized sidebar

type Outline = {
  baseLevel: number
  tree: OutlineItem[]
}

type OutlineItem = { level: number; textContent: string }

const Outline: React.FC<{ editorContent: Node[] }> = ({ editorContent }) => {
  const [outline, setOutline] = useState<Outline>({
    baseLevel: 3,
    tree: [],
  })

  useEffect(() => {
    setOutline(() => {
      const newOutline: Outline = { baseLevel: 3, tree: [] }
      editorContent.forEach((node) => {
        if (node?.type.startsWith("heading_")) {
          const textContent = node?.children[0]?.text
          if (textContent !== undefined && textContent.trim() !== "") {
            const headingLevel = Number(node.type[node.type.length - 1])
            const trimmedContent: string = textContent.slice(
              0,
              Math.min(textContent.length, OUTLINE_HEADING_MAX_LENGTH)
            )

            // The heading level is supposed to be the biggest heading (lowest number)
            if (headingLevel < newOutline.baseLevel) {
              newOutline.baseLevel = headingLevel
            }

            newOutline.tree.push({
              level: headingLevel,
              textContent: trimmedContent,
            })
          }
        }
      })
      console.log(newOutline)
      return newOutline
    })
  }, [editorContent])

  console.log(outline)

  return (
    <OutlineContainer>
      {outline.tree.map((item) => (
        <OutlineItem level={item.level} baseLevel={outline.baseLevel}>
          <OutlineIcon>H{item.level}</OutlineIcon>
          {item.textContent}
        </OutlineItem>
      ))}
    </OutlineContainer>
  )
}

const OutlineItem = styled.div<{ level: number; baseLevel: number }>`
  cursor: default;
  font-weight: normal;
  padding: 4px 0;
  padding-left: ${(p) => (p.level - p.baseLevel) * 16}px;
  color: #afb3b6;
  display: flex;
  font-size: 12px;
  align-items: center;
`

const OutlineIcon = styled.span`
  margin-right: 6px;
  font-size: 12px;
  color: #41474d;
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

const Container = styled.div<{ isCurrent: boolean }>`
  ${(p) => p.isCurrent && `font-weight: bold;`}
  padding: 3px 0;

  :hover ${DeleteButton} {
    opacity: 1;
  }
`

const MainContainer = styled.div`
  display: flex;
  align-items: center;
`

const OutlineContainer = styled.div``

const Title = styled.div`
  cursor: pointer;
  color: #fbfbfb;
  flex: 1;
`

export default SidebarDocumentItem
