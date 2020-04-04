import { Editor, NodeEntry, Location, Range, Ancestor } from "slate"

/**
 * The `Block` interface is a very specific kind of slate node.
 * It is the block-level element which always has a 'type' property.
 */
export interface Block extends Element {
  type: string
}

export const Block = {
  /**
   * Get closest block node ancestor
   */
  closest(editor, options: { at?: Location } = {}): NodeEntry<Ancestor> {
    const nodeEntry = Editor.above(editor, {
      at: options.at,
      match: (n) => Editor.isBlock(editor, n)
    })
    if (!nodeEntry) throw new Error("There is no closest block")
    return nodeEntry
  },

  /**
   * Get first block at given location
   */
  first(editor, options: { at?: Range } = {}): NodeEntry<Ancestor> {
    const { at = editor.selection } = options
    const startPoint = Range.start(at)
    return Block.closest(editor, { at: startPoint })
  },

  /**
   * Get last block at given location
   */
  last(editor, options: { at?: Range } = {}): NodeEntry<Ancestor> {
    const { at = editor.selection } = options
    const endPoint = Range.end(at)
    return Block.closest(editor, { at: endPoint })
  }
}