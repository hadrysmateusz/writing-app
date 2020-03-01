import { useMemo } from "react"
import { createEditor } from "slate"
import { ReactEditor } from "slate-react"

import { compose } from "lodash/fp"

function useCreateEditor(plugins): ReactEditor {
	return useMemo(() => {
		return compose(...plugins, createEditor)()
	}, [plugins])
}

export default useCreateEditor
