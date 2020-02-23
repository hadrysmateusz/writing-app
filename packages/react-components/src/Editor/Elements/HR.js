import React from "react"
import { css } from "styled-components/macro"

const styles = css`
	display: block;
	text-align: center;
	border-bottom: 2px solid #ddd;
`

const HR = ({ attributes }) => {
	return <hr css={styles} {...attributes} />
}

export default HR
