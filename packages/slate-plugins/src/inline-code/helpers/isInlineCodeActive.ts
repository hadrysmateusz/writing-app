import { Editor } from "slate"

import { matchType } from "@writing-tool/helpers"

import { CODE_INLINE } from "../types"

export const isInlineCodeActive = (editor) => {
	const [link] = Editor.nodes(editor, { match: matchType(CODE_INLINE) })
	return !!link
}
