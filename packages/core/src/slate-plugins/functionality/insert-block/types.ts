import { Node } from "slate"

export interface InsertBlockPluginOptions {
  include?: string[]
  exclude?: string[]
  hotkey?: string
  defaultType?: string
  node?: Node
}
