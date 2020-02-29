import { useMemo } from "react"
import { createEditor } from "slate"

import { compose } from "lodash/fp"

function useCreateEditor(plugins) {
	return useMemo(compose(...plugins, createEditor)(), [])
}

export default useCreateEditor
