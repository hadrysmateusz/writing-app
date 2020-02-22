import React from "react"
import { css } from "styled-components/macro"

import FeatureToggles from "./Components/FeatureToggles"

const containerStyles = css`
	position: absolute;
	bottom: 0;
	background: black;
	opacity: 0.4;
	color: white;
	width: 100%;
	padding: 20px;
	height: 60px;
	width: 60px;
	transition: all 0.3s;

	:hover {
		height: 300px;
		width: 100%;
		opacity: 0.9;
	}

	.tools {
		display: none;
	}

	:hover .tools {
		display: block;
	}
`

const DevTools = ({ local = null }) => {
	return (
		<div css={containerStyles}>
			<div>🛠</div>
			<div className="tools">
				{local}
				<FeatureToggles />
			</div>
		</div>
	)
}

export default DevTools
