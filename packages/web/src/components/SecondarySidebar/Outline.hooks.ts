import { useEffect, useState } from "react"
import { usePlateSelectors } from "@udecode/plate-core"
import { useTabsState } from "../TabsProvider"

const OUTLINE_HEADING_MAX_LENGTH = 40 // TODO: this might need to change to fit a resized sidebar

type OutlineType = {
  baseLevel: number
  tree: OutlineItemType[]
}

type OutlineItemType = { level: number; textContent: string }

export const useDocumentOutline = () => {
  const { currentDocumentId } = useTabsState()
  const editorValue = usePlateSelectors(currentDocumentId).value()

  const [outline, setOutline] = useState<OutlineType>({
    baseLevel: 3,
    tree: [],
  })

  useEffect(() => {
    if (!editorValue) {
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

  return outline
}
