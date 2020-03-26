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
  ParagraphPlugin,
  HorizontalRulePlugin
} from "../../slate-plugins"

const HistoryPlugin = () => ({ editorOverrides: withHistory })

export const plugins = [
  HistoryPlugin(),
  MarkdownShortcutsPlugin({
    onToggleOverrides: { [ListType.UL_LIST]: toggleList, [ListType.OL_LIST]: toggleList }
  }),
  LoggerPlugin(),
  LinkPlugin(),
  BlockquotePlugin(),
  ListPlugin(),
  HeadingsPlugin({ levels: 6 }),
  HorizontalRulePlugin(),
  CodeBlockPlugin(),
  InsertBlockPlugin(),
  BoldPlugin({ hotkey: "mod+b" }),
  ItalicPlugin({ hotkey: "mod+i" }),
  StrikethroughPlugin({ hotkey: "mod+shift+k" }),
  InlineCodePlugin({ hotkey: "mod+e" }),
  SoftBreakPlugin({
    exclude: [...Object.values(HeadingType)]
  }),
  ParagraphPlugin()
]
