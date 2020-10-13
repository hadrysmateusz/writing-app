import { Editor } from "slate"

export type ShortcutUnit = string | RegExp
export type ShortcutMatch = ShortcutUnit | ShortcutUnit[]
export type ShortcutsList = { [key: string]: ShortcutMatch }
type ToggleOverrideFunction = <T extends Editor>(
  editor: T,
  type: string,
  shortcut: ShortcutUnit
) => any

// TODO: make sure the "type" parameter of toggleList is the same type as type of list in the "types" object
export interface MarkdownShortcutsPluginOptions {
  types?: {
    UL?: string
    OL?: string
    LI?: string
    BLOCKQUOTE?: string
    CODE_BLOCK?: string
    H1?: string
    H2?: string
    H3?: string
    H4?: string
    H5?: string
    H6?: string
  }
  shortcutOverrides?: ShortcutsList
  onToggleOverrides?: { [key: string]: ToggleOverrideFunction }
}
