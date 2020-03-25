import { Node } from "slate"

/**
 * Checks if the node should be included based on include and exclude arrays.
 * @param node Node which type of will be checked
 * @param include If undefined all node types are included, otherwise only types in this array will be included
 * @param exclude If undefined has no effect, otherwise any type in it will be excluded even if it's also in the include array
 */
export const isNodeIncluded = (
  node: Node,
  include: string[] | undefined,
  exclude: string[] | undefined
): boolean => {
  const isExcluded = exclude && exclude.includes(node.type)
  const isNotIncluded = include && !include.includes(node.type)
  return !(isExcluded || isNotIncluded)
}
