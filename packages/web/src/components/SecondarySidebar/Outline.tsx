import { usePlateEventId, usePlateValue } from "@udecode/plate-core"
import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"

const OUTLINE_HEADING_MAX_LENGTH = 40 // TODO: this might need to change to fit a resized sidebar

type OutlineType = {
  baseLevel: number
  tree: OutlineItemType[]
}

type OutlineItemType = { level: number; textContent: string }

export const Outline: React.FC = () => {
  const editorValue = usePlateValue(usePlateEventId("focus"))

  const [outline, setOutline] = useState<OutlineType>({
    baseLevel: 3,
    tree: [],
  })

  useEffect(() => {
    if (editorValue === undefined) {
      // TODO: handle this better (probably check higher up and ensure it's defined)
      return
    }

    setOutline(() => {
      const newOutline: OutlineType = { baseLevel: 3, tree: [] }

      // TODO: this is garbage. it only goes through top-level nodes which might not be enough if any kind of organizational node is introduced or even if headings are nested in a list or blockquote. It should either use some slate api to get all nodes, or deeply go through nodes recursively.
      editorValue.forEach((node) => {
        const nodeType = "type" in node ? node.type : null

        if (nodeType === null) return

        const nodeChildren = "children" in node ? node.children : null

        if (nodeChildren === null) return

        let headingRegExp = /^h[123456]$/

        if (headingRegExp.test(nodeType)) {
          const childTextNode = nodeChildren[0]

          if (!("text" in childTextNode)) return

          const textContent = childTextNode.text

          if (textContent.trim() !== "") {
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
  }, [editorValue])

  const isEmpty = outline.tree.length === 0

  return (
    <OutlineContainer>
      {isEmpty ? (
        <div className="Outline_EmptyState">
          No headings in current document
        </div>
      ) : (
        outline.tree.map((item) => (
          // TODO: replace the key with something that is guaranteed to be unique
          <OutlineItem
            key={item.level + item.textContent}
            level={item.level}
            baseLevel={outline.baseLevel}
          >
            <OutlineIcon>H{item.level}</OutlineIcon>
            {item.textContent}
          </OutlineItem>
        ))
      )}
    </OutlineContainer>
  )
}

const OutlineContainer = styled.div`
  .Outline_EmptyState {
    font-size: 12px;
    color: var(--light-200);
    user-select: none;
  }

  :not(:empty) {
    padding-top: 4px;
  }
`

const OutlineItem = styled.div<{ level: number; baseLevel: number }>`
  cursor: default;
  font-weight: normal;
  padding: 4px 0;
  padding-left: ${(p) => (p.level - p.baseLevel) * 16}px;
  color: var(--light-300);
  display: flex;
  font-size: 12px;
  align-items: center;
`

const OutlineIcon = styled.span`
  margin-right: 6px;
  font-size: 12px;
  color: var(--dark-500);
`
