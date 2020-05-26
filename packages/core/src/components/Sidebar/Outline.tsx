import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"
import { Node } from "slate"

const OUTLINE_HEADING_MAX_LENGTH = 40 // TODO: this might need to change to fit a resized sidebar

type Outline = {
  baseLevel: number
  tree: OutlineItem[]
}

type OutlineItem = { level: number; textContent: string }

export const Outline: React.FC<{ editorContent: Node[] }> = ({
  editorContent,
}) => {
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
      return newOutline
    })
  }, [editorContent])

  return (
    <OutlineContainer>
      {outline.tree.map((item) => (
        // TODO: replace the key with something that is guaranteed to be unique
        <OutlineItem
          key={item.level + item.textContent}
          level={item.level}
          baseLevel={outline.baseLevel}
        >
          <OutlineIcon>H{item.level}</OutlineIcon>
          {item.textContent}
        </OutlineItem>
      ))}
    </OutlineContainer>
  )
}

const OutlineContainer = styled.div`
  :not(:empty) {
    padding-top: 4px;
  }
`

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
