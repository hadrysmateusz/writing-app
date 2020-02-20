import React from "react"

const HR = ({ attributes, children }) => {
	return (
		<p {...attributes}>
			<hr />
		</p>
	)
}

export default HR
