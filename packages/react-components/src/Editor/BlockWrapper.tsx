import React from "react"
import styled from "styled-components/macro"
import { useSlate } from "slate-react"

const Toolbar = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: -50px;
	color: #999;
	display: none;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
	font-weight: bold;
	font-size: 20px;
	cursor: pointer;
`

const Wrapper = styled.div`
	position: relative;
	:hover {
		${Toolbar} {
			display: flex;
		}
	}
`

export const BlockWrapper = ({ children, element }) => {
	const editor = useSlate()

	if (editor.isInline(element)) return children

	return (
		<Wrapper>
			<div>{children}</div>
			<Toolbar
				onMouseDown={(e) => {
					// Prevent Slate errors
					e.preventDefault()
					e.stopPropagation()
				}}
			>
				+
			</Toolbar>
		</Wrapper>
	)
}
