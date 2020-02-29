import React from "react"

const Paragraph = ({ attributes, children }) => {
	return <p {...attributes}>{children}</p>
}

export default Paragraph
