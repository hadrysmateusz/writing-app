import { ELEMENT_PARAGRAPH } from "@udecode/plate"
import cloneDeep from "lodash/cloneDeep"

/**
 * Helper for creating a basic empty node
 *
 * The deep cloning prevents issues with react keys
 */
export const createEmptyNode = () => {
  return cloneDeep({
    type: ELEMENT_PARAGRAPH,
    children: [{ text: "" }],
  })
}
