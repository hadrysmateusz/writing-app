import { Ancestor } from "slate"

/**
 * Is the node's leaf node's text content empty
 * TODO: this might return a false positive when a node has some marks
 */
export const isBlockTextEmpty = (node: Ancestor) =>
	node.children && node.children[node.children.length - 1]?.text?.length === 0
