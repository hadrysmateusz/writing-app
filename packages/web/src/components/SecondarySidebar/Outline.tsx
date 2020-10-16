import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"
import { Node, Descendant } from "slate"

import { useEditorState } from "../Main"

const OUTLINE_HEADING_MAX_LENGTH = 40 // TODO: this might need to change to fit a resized sidebar

type Outline = {
  baseLevel: number
  tree: OutlineItem[]
}

type OutlineItem = { level: number; textContent: string }

export const Outline: React.FC = () => {
  const { editorValue: editorContent } = useEditorState()

  const [outline, setOutline] = useState<Outline>({
    baseLevel: 3,
    tree: [],
  })

  useEffect(() => {
    setOutline(() => {
      const newOutline: Outline = { baseLevel: 3, tree: [] }

      // TODO: this is garbage. it only goes through top-level nodes which might not be enough if any kind of organizational node is introduced or even if headings are nested in a list or blockquote. It should either use some slate api to get all nodes, or deeply go through nodes recursively.
      editorContent.forEach((node) => {
        node = node as Descendant

        const nodeType = node.type
        const nodeChildren = node.children as Node[] | undefined

        if (typeof nodeType !== "string") {
          console.warn("No type detected on node", node)
          return
        }

        if (nodeChildren === undefined) {
          // node is a leaf node
          return
        }

        if (nodeType.startsWith("heading_")) {
          const textContent = nodeChildren[0]?.text

          if (typeof textContent !== "string") return

          if (textContent !== undefined && textContent.trim() !== "") {
            const headingLevel = Number(nodeType[nodeType.length - 1])
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
