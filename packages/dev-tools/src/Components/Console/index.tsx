import React from "react"

export function ClearConsole() {
	return (
		<div>
			<button onClick={() => console.clear()}>Clear Console</button>
		</div>
	)
}
