import { withBreakInsertDefault } from "../../../slate-helpers"

import { BLOCKQUOTE } from "./types"

export const withBlockquote = withBreakInsertDefault({ types: [BLOCKQUOTE] })
