import { Editor, Transforms } from "slate"
import { DEFAULT, isBlockTextEmpty } from ".."

/**
 * On insert break at the start of an empty block in types,
 * replace it with a new paragraph.
 *
 * TODO: Only works in nodes where the text node is an immediate and only child, improve this
 */
export const withBreakEmptyReset = ({
  types,
  onUnwrap,
}: {
  types: string[]
  onUnwrap?: any
}) => <T extends Editor>(editor: T) => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    // const currentNodeEntry = Editor.above(editor, {
    //   match: (n) => Editor.isBlock(editor, n),
    // })

    // if (currentNodeEntry) {
    //   const [currentNode] = currentNodeEntry

    //   if (isBlockTextEmpty(currentNode)) {
    //     const parent = Editor.above(editor, {
    //       match: (n) =>
    //         typeof n.type === "string" ? types.includes(n.type) : false,
    //     })

    //     if (parent) {
    //       Transforms.setNodes(editor, { type: DEFAULT })

    //       if (onUnwrap) onUnwrap(editor)

    //       return
    //     }
    //   }
    // }

    insertBreak()
  }

  return editor
}
