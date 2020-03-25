import { withHistory } from "slate-history"
import {
  LoggerPlugin,
  InlineCodePlugin,
  LinkPlugin,
  HeadingsPlugin,
  BlockquotePlugin,
  CodeBlockPlugin,
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  ListPlugin,
  MarkdownShortcutsPlugin,
  toggleList,
  ListType,
  SoftBreakPlugin,
  InsertBlockPlugin,
  HeadingType,
  ParagraphPlugin
} from "../../slate-plugins"

const HistoryPlugin = () => ({ editorOverrides: withHistory })

export const plugins = [
  HistoryPlugin(),
  // Exclude headings from the soft-break plugin
  SoftBreakPlugin({
    exclude: [...Object.values(HeadingType)]
  }),
  MarkdownShortcutsPlugin({
    onToggleOverrides: { [ListType.UL_LIST]: toggleList, [ListType.OL_LIST]: toggleList }
  }),
  InsertBlockPlugin(),
  LoggerPlugin(),
  BoldPlugin({ hotkey: "mod+b" }),
  ItalicPlugin({ hotkey: "mod+i" }),
  StrikethroughPlugin({ hotkey: "mod+shift+k" }),
  InlineCodePlugin({ hotkey: "mod+e" }),
  LinkPlugin(),
  BlockquotePlugin(),
  CodeBlockPlugin(),
  ListPlugin(),
  HeadingsPlugin({ levels: 6 }),
  ParagraphPlugin()
]
