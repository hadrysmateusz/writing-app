import isHotkey from "is-hotkey"
import { Block, isNodeIncluded } from "../../../slate-helpers"
import { Editor, Transforms, Path } from "slate"
import { InsertBlockPluginOptions } from "./types"
import { cloneDeep } from "lodash"

const defaultNode = { type: "paragraph", children: [{ text: "" }] }

export const onKeyDownInsertBlock = ({
  hotkey = "mod+Enter",
  node = defaultNode,
  include,
  exclude
}: InsertBlockPluginOptions = {}) => (event: KeyboardEvent, editor: Editor) => {
  if (isHotkey(hotkey, event)) {
    const [lastNode, lastPath] = Block.last(editor)
    if (!isNodeIncluded(lastNode, include, exclude)) return
    const nextPath = Path.next(lastPath)
    // the node has to be deep cloned or else the react-keys will get duplicated
    Transforms.insertNodes(editor, cloneDeep(node), { at: nextPath, select: true })
  }
}
