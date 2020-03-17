import { SlatePlugin } from "@writing-tool/slate-plugin-system"

import { withLogger } from "./editorOverrides"

export const LoggerPlugin = (): SlatePlugin => ({
	editorOverrides: withLogger
})
