import { Editor } from "slate"

export interface SoftBreakPluginOptions {
  include?: string[]
  exclude?: string[]
  hotkey?: string
}

export interface SoftBreakCommands {
  insertSoftBreak(): void
}

export interface SoftBreakEditor extends Editor, SoftBreakCommands {}
