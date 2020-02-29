import React from "react"
import { css } from "styled-components/macro"

const styles = css`
	font-family: monospace;
	background-color: #f5f5f5;
	color: #111;
	padding: 8px;
	border-radius: 5px;
`

const Code = ({ attributes, children }) => {
	return (
		<pre css={styles} {...attributes}>
			<code>{children}</code>
		</pre>
	)
}

export default Code
