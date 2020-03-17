import { Path, Node, NodeEntry } from "slate"

export const splitNodeEntries = (entries: NodeEntry[]): [Node[], Path[]] => {
	const nodes: Node[] = []
	const paths: Path[] = []
	entries.forEach(([node, path]) => {
		nodes.push(node)
		paths.push(path)
	})
	const tuple: [Node[], Path[]] = [nodes, paths]
	return tuple
}

export const pathsFromNodeEntries = (entries: NodeEntry[]): Path[] => {
	return entries.map(([, path]) => path)
}

export const nodesFromNodeEntries = (entries: NodeEntry[]): Node[] => {
	return entries.map(([node]) => node)
}
