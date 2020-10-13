import { Ancestor, Editor, Element, Node } from "slate"

/**
 * Is node an ancestor
 */
export const isAncestor = (node: Node): node is Ancestor =>
  Element.isElement(node) || Editor.isEditor(node)
