import { Editor, Element, Node } from "slate"

const isBlockNode = (editor: Editor, n: Node) => {
  return !Editor.isEditor(n) && Element.isElement(n) && !editor.isInline(n)
}

export default isBlockNode
