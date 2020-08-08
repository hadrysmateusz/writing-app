import { Node } from "slate"

// TODO: support lists (newlines and indentation)
// TODO: consider not adding empty lines where images should be (or some other custom handling)
export const serializeText = (nodes: Node[]) => {
  return nodes.map((n) => Node.string(n)).join("\n")
}
