import { SlatePlugin } from "@writing-tool/slate-plugins-system"

import { withOperationLogger } from "./withOperationLogger"

export const OperationLoggerPlugin = (): SlatePlugin => ({
	editorOverrides: withOperationLogger
})
