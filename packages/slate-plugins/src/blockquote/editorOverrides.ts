import { withBreakInsertDefault } from "@writing-tool/slate-helpers"

import { BLOCKQUOTE } from "./types"

export const withBlockquote = withBreakInsertDefault({ types: [BLOCKQUOTE] })
