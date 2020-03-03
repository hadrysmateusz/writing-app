import { useMemo } from "react"
import { createEditor } from "slate"

import { compose } from "lodash/fp"

/**
 * Creates the editor object and applies all of the passed-in plugins
 *
 * @param plugins array of plugins
 */

export function useCreateEditor(plugins = []) {
	plugins = plugins.reduce((acc, plugin) => {
		if (!plugin.editorOverrides) {
			return acc
		} else {
			return [...acc, plugin.editorOverrides]
		}
	}, [])
	/* Compose is a higher-order function returning a function that will be run be the hook - I'm not wrapping it because it would require adding 'plugins' as the hook's dependency which in turn would require making sure the plugins array stays the same on every render to prevent re-creating the editor every time */
	return useMemo(compose(...plugins, createEditor), [])
}
