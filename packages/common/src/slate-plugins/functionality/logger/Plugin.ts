import { SlatePlugin } from "@slate-plugin-system/core"

import { withLogger } from "./editorOverrides"

export const LoggerPlugin = (): SlatePlugin => ({
	editorOverrides: withLogger
})
