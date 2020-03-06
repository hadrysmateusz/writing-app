import { Editor, NodeEntry, Range } from "slate"
import { RenderElementProps, RenderLeafProps, ReactEditor } from "slate-react"

export type Decorate = (entry: NodeEntry) => Range[]
export type OnDOMBeforeInput = (event: Event, editor: Editor) => void
export type RenderElement = (props: RenderElementProps) => JSX.Element | undefined
export type RenderLeaf = (props: RenderLeafProps) => JSX.Element
export type OnKeyDown = (e: any, editor: Editor, props?: any) => void
export type EditorOverrides = <T extends ReactEditor>(editor: T) => T

export interface SlatePlugin {
	decorate?: Decorate
	onDOMBeforeInput?: OnDOMBeforeInput
	renderElement?: RenderElement
	renderLeaf?: RenderLeaf
	onKeyDown?: OnKeyDown
	editorOverrides?: EditorOverrides
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

export interface MarkPluginOptions extends RenderInlineOptions {
	hotkey?: string
}

export interface InlinePluginOptions extends RenderInlineOptions {
	hotkey?: string
}

export interface ElementPluginOptions extends RenderElementOptions {}
