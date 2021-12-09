import cloneDeep from "lodash/cloneDeep"

/**
 * Helper for creating a basic empty node
 *
 * The deep cloning prevents issues with react keys
 */
export const createEmptyNode = () => {
  return cloneDeep({
    type: "paragraph",
    children: [{ text: "" }],
  })
}
