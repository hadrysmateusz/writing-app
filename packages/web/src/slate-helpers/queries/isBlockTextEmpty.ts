import { Ancestor, Descendant, Text } from "slate"

/**
 * Is the node's leaf node's text content empty
 * TODO: this might return a false positive when a node has some marks
 */
export const isBlockTextEmpty = (node: Ancestor) => {
  const lastChild: Descendant = node.children[node.children.length - 1]
  return Text.isText(lastChild) && !lastChild.text.length
}
