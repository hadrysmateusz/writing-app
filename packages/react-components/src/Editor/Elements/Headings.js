import React from "react"

export const Heading1 = ({ attributes, children }) => {
	return <h1 {...attributes}>{children}</h1>
}

export const Heading2 = ({ attributes, children }) => {
	return <h2 {...attributes}>{children}</h2>
}

export const Heading3 = ({ attributes, children }) => {
	// level 3 is treated like level 2 on medium
	return <h3 {...attributes}>{children}</h3>
}

export const Heading4 = ({ attributes, children }) => {
	// level 4 is treated like level 2 on medium
	return <h4 {...attributes}>{children}</h4>
}

export const Heading5 = ({ attributes, children }) => {
	// level 5 is not supported on medium and will be rendered like regular text
	return <h5 {...attributes}>{children}</h5>
}

export const Heading6 = ({ attributes, children }) => {
	// level 6 is not supported on medium and will be rendered like regular text
	return <h6 {...attributes}>{children}</h6>
}
