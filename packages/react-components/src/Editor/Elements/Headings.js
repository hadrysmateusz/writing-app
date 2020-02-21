import React from "react"
import { css } from "styled-components/macro"

const heading_big = css`
	font-weight: bold;
	font-size: 26px;
	margin: 20px 0 10px 0;
`

const heading_small = css`
	font-weight: bold;
	font-size: 20px;
	margin: 20px 0 10px 0;
`

export const Heading1 = ({ attributes, children }) => {
	return (
		<h1 css={heading_big} {...attributes}>
			{children}
		</h1>
	)
}

export const Heading2 = ({ attributes, children }) => {
	return (
		<h2 css={heading_small} {...attributes}>
			{children}
		</h2>
	)
}

export const Heading3 = ({ attributes, children }) => {
	// level 3 is treated like level 2 on medium
	return (
		<h3 css={heading_small} {...attributes}>
			{children}
		</h3>
	)
}

export const Heading4 = ({ attributes, children }) => {
	// level 4 is treated like level 2 on medium
	return (
		<h4 css={heading_small} {...attributes}>
			{children}
		</h4>
	)
}

export const Heading5 = ({ attributes, children }) => {
	// level 5 is not supported on medium and will be rendered like regular text
	return <h5 {...attributes}>{children}</h5>
}

export const Heading6 = ({ attributes, children }) => {
	// level 6 is not supported on medium and will be rendered like regular text
	return <h6 {...attributes}>{children}</h6>
}
