import React from "react"
import { css } from "styled-components/macro"

const styles = css`
	display: inline-block;
	border-left: 2px solid #ddd;
	padding-left: 10px;
	margin-left: 0;
	margin-right: 0;
	color: #aaa;
	font-style: italic;
`

const Blockquote = ({ attributes, children }) => {
	return (
		<blockquote css={styles} {...attributes}>
			{children}
		</blockquote>
	)
}

export default Blockquote
