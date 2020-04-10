import { Path, Editor, Transforms } from "slate"
import { HORIZONTAL_RULE } from "../types"
import { PARAGRAPH } from "../../paragraph"
import { Block } from "../../../../slate-helpers"

// TODO: replace the hardcoded paragraph type with one passed as plugin option
export const insertHorizontalRule = (editor: Editor) => {
  Editor.withoutNormalizing(editor, () => {
    // TODO: replace with a top-level element to support deeply nested nodes (e.g. lists)
    const [, lastPath] = Block.last(editor)
    const hrPath = Path.next(lastPath)
    const pPath = Path.next(hrPath)
    const hrNode = { type: HORIZONTAL_RULE, children: [] }
    const pNode = { type: PARAGRAPH, children: [{ text: "" }] }

    Transforms.insertNodes(editor, hrNode, { at: hrPath, select: false })
    Transforms.insertNodes(editor, pNode, { at: pPath, select: true })
  })
}
