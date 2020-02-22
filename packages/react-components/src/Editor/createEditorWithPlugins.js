import { createEditor } from "slate"
import { withHistory } from "slate-history"
import { withReact } from "slate-react"
import { compose } from "lodash/fp"

import withMarkdownShortcuts from "./Plugins/withMarkdownShortcuts"
import withOperationLogger from "./Plugins/withOperationLogger"

/**
 * Creates a Slate editor and applies plugins
 */
function createEditorWithPlugins() {
	return compose(
		withOperationLogger,
		withMarkdownShortcuts,
		withHistory,
		withReact,
		createEditor
	)()
}

export default createEditorWithPlugins
