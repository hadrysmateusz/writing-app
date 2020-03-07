import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { withLogger } from "./editorOverrides"

export const LoggerPlugin = (): SlatePlugin => ({
	editorOverrides: withLogger
})
