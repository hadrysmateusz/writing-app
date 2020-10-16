import { Transforms, Editor } from "slate"
import { ReactEditor } from "slate-react"

interface BreakInsertDefaultOptions {
  types: string[]
  defaultType?: string
}

/* TODO: the current solution isn't perfect, when working with multi-block selections, 
  you can end up with different results after the first time a lineBreak is added and after undo+redoing.

  Also, multi-block breaking should probably end up with the last line's formatting
  being the only one left, and definitely with only one line left instead of two.

  Multi-block breaking might also be difficult if I allow any plugin specify it's own line-break behavior for different element types

  I might actually want to turn any multi-block selection into a selection of top-level block wrappers like Notion
*/

/**
 * When inserting a lineBreak on a node matching one of the provided types, it will insert a default node (paragraph) instead

 * This function is a factory that creates the overrides function based on the options
 */
export const withBreakInsertDefault = ({
  types = [],
  defaultType = "paragraph",
}: BreakInsertDefaultOptions) => <T extends ReactEditor>(editor: T) => {
  const { insertBreak } = editor

  editor.insertBreak = () => {
    const oldSelection = editor.selection
    insertBreak()

    if (oldSelection === null) {
      console.warn("Can't insert default. Selection is null.")
      return
    }

    try {
      const pathToFirstNode = Editor.first(editor, oldSelection)[1]
      const firstBlock = Editor.parent(editor, pathToFirstNode)[0]

      if (
        firstBlock &&
        typeof firstBlock.type === "string" &&
        types.includes(firstBlock.type)
      ) {
        const newSelection = editor.selection
        const { anchor: originalAnchor, focus: originalFocus } = oldSelection
        if (newSelection) {
          const startIsSelected =
            originalAnchor.offset === 0 || originalFocus.offset === 0
          const transformPath = [
            newSelection.anchor.path[0] - (startIsSelected ? 1 : 0),
          ]
          Transforms.setNodes(
            editor,
            { type: defaultType },
            { at: transformPath }
          )
        }
      }
    } catch (e) {
      /* this trycatch block is here to prevent errors (mainly with lists)
				if it encounters an error it just gives up which in most situations shouldn't be too bad

				TODO: improve the logic of this function so that the trycatch block is not necessary
			*/
    }
  }

  return editor
}
