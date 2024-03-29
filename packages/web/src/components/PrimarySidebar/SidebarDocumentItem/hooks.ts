import { useMemo } from "react"
import { Ancestor, Node } from "slate"

import { deserialize } from "../../Editor"

const SNIPPET_LENGTH = 340

export const useDocumentSnippet = (serializedContent: string) => {
  return useMemo(() => {
    // TODO: replace with a better solution that simply limits the text to some number of lines (probably with css)

    let textContent = ""

    // if the content field was empty or unefined we return undefined to not render a snippet
    if (!serializedContent?.trim()) return undefined

    const deserializedContent = deserialize(serializedContent)

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
  }, [serializedContent])
}
