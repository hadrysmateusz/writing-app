import { NodeEntry, Range, Editor } from "slate"
import { RenderElementProps, RenderLeafProps } from "slate-react"

/**
 *  EditorOverrides generic takes two types:
 *
 * - The editor it will receive (E)
 * - The editor it will return (O)
 *
 *  It uses smart defaults to simplify development
 */
export type EditorOverrides<E extends Editor = Editor, O = E> = (editor: E) => O

/**
 *  OnKeyDown accepts an optional editor type that defaults to the default Editor
 */
export type OnKeyDown<E extends Editor = Editor> = (
  e: React.KeyboardEvent<HTMLDivElement>,
  editor: E,
  props?: any
) => void

/**
 *  OnDOMBeforeInput accepts an optional editor type that defaults to the default Editor
 */
export type OnDOMBeforeInput<E extends Editor = Editor> = (
  event: Event,
  editor: E
) => void

/**
 *  RenderElement can return undefined in case the criteria for rendering isn't met
 */
export type RenderElement = (
  props: RenderElementProps
) => JSX.Element | undefined

/**
 *  RenderLeaf always returns a JSX element (even if unmodified) to support multiple marks on a node
 */
export type RenderLeaf = (props: RenderLeafProps) => JSX.Element

export type Decorate = (entry: NodeEntry) => Range[]

// Plugin Options
export interface SlatePlugin<E extends Editor = Editor, O = E> {
  editorOverrides?: EditorOverrides<E, O>
  onDOMBeforeInput?: OnDOMBeforeInput<E>
  onKeyDown?: OnKeyDown<E>
  renderElement?: RenderElement
  renderLeaf?: RenderLeaf
  decorate?: Decorate
}

// GetRender Options
export interface GetRenderLeafOptions {
  type: string
  component: any
}
export interface GetRenderElementOptions {
  type: string
  component: any
}

// Render Options
export interface RenderElementOptions {
  component?: any
}
export interface RenderLeafOptions {
  component?: any
}
export interface RenderInlineOptions {
  component?: any
}

// Plugin Options
export interface ElementPluginOptions extends RenderElementOptions {}
export interface MarkPluginOptions extends RenderInlineOptions {
  hotkey?: string
}
export interface InlinePluginOptions extends RenderInlineOptions {
  hotkey?: string
}
