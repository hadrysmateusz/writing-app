import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { withSelectionLogger } from "./editorOverrides"

export const LoggerPlugin = (): SlatePlugin => ({
	editorOverrides: withSelectionLogger
})
