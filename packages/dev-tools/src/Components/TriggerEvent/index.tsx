import React from "react"

import { dispatchDevToolsEvent } from "../../Lib/events"

const TriggerEvent = ({ name }) => {
	return (
		<div>
			<button onMouseDown={() => dispatchDevToolsEvent(name)}>{name}</button>
		</div>
	)
}

export default TriggerEvent
