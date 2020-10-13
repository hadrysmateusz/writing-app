import { withHistory } from "slate-history"
import { withReact } from "slate-react"
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
  SoftBreakPlugin,
  InsertBlockPlugin,
  HeadingType,
  ParagraphPlugin,
  HorizontalRulePlugin,
  MoveNodesPlugin,
  ImagePlugin,
  OnBreakSetDefaultPlugin,
} from "./slate-plugins"
import { ListType } from "./slateTypes"

const HistoryPlugin = () => ({ editorOverrides: withHistory })
const ReactPlugin = () => ({ editorOverrides: withReact })

export const plugins = [
  HistoryPlugin(),
  MoveNodesPlugin(),
  ImagePlugin(),
  MarkdownShortcutsPlugin({
    onToggleOverrides: {
      [ListType.UL_LIST]: toggleList,
      [ListType.OL_LIST]: toggleList,
    },
  }),
  LoggerPlugin(),
  LinkPlugin(),
  BlockquotePlugin(),
  ListPlugin(),
  OnBreakSetDefaultPlugin(),
  HeadingsPlugin({ levels: 6 }),
  HorizontalRulePlugin(),
  CodeBlockPlugin(),
  InsertBlockPlugin(),
  BoldPlugin({ hotkey: "mod+b" }),
  ItalicPlugin({ hotkey: "mod+i" }),
  StrikethroughPlugin({ hotkey: "mod+shift+k" }),
  InlineCodePlugin({ hotkey: "mod+e" }),
  SoftBreakPlugin({
    exclude: [...Object.values(HeadingType)],
  }),
  ParagraphPlugin(),
  ReactPlugin(),
]
