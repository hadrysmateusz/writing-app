import { Transforms } from "slate"

import { matchType } from "@writing-tool/helpers"

import { CODE_INLINE } from "../types"

export const unwrapInlineCode = (editor) => {
	Transforms.unwrapNodes(editor, { match: matchType(CODE_INLINE) })
}
