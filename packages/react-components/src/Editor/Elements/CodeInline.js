import React from "react"
import { css } from "styled-components/macro"

const styles = css`
	display: inline-block;
	font-family: monospace;
	background-color: #f5f5f5;
	color: #111;
	padding: 3px 6px;
	border-radius: 5px;
`

const Code = ({ attributes, children }) => {
	return (
		<code css={styles} {...attributes}>
			{children}
		</code>
	)
}

export default Code
