import { Path, Node } from "slate"

export const isLastChild = (editor, path: Path): boolean => {
  const lastIndex = path[path.length - 1]

  const parentNode = Node.parent(editor, path)
  const numChildren = parentNode.children.length
  return lastIndex === numChildren - 1
}
