import { withBreakInsertDefault } from "../../../slate-helpers"

import { PARAGRAPH } from "./types"

export const withParagraph = withBreakInsertDefault({ types: [PARAGRAPH] })
