import { Editor, Point, Range, Transforms } from "slate"
import { DEFAULT } from ".."

/**
 * On delete at the start of an empty block in types,
 * replace it with a new paragraph.
 */
export const withDeleteStartReset = ({
  types,
  onUnwrap,
}: {
  types: string[]
  onUnwrap?: any
}) => <T extends Editor>(editor: T) => {
  const { deleteBackward } = editor

  editor.deleteBackward = (...args) => {
    // const { selection } = editor

    // if (selection && Range.isCollapsed(selection)) {
    //   const parent = Editor.above(editor, {
    //     match: (n) =>
    //       typeof n.type === "string" ? types.includes(n.type) : false,
    //   })

    //   if (parent) {
    //     const [, parentPath] = parent
    //     const parentStart = Editor.start(editor, parentPath)

    //     if (Point.equals(selection.anchor, parentStart)) {
    //       Transforms.setNodes(editor, { type: DEFAULT })

    //       if (onUnwrap) onUnwrap(editor)

    //       return
    //     }
    //   }
    // }

    deleteBackward(...args)

    // temporary quick fix for list item
    // const match = Editor.above(editor, {
    //   match: n => unwrapTypes.includes(n.type),
    // });

    // if (match) {
    //   const [li] = Editor.nodes(editor, {
    //     match: n => n.type === ListType.LIST_ITEM,
    //   });

    //   if (!li) {
    //     Transforms.setNodes(editor, { type: ListType.LIST_ITEM });
    //   }
    // }
  }

  return editor
}
