import React from "react"
import styled from "styled-components/macro"
import { useSlate } from "slate-react"
import Icon from "../Icon"
import { ListType } from "@writing-tool/slate-plugins"

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
	user-select: none;
	* {
		user-select: none;
	}
`

const Wrapper = styled.div`
	position: relative;
	:hover > ${Toolbar} {
		display: flex;
	}
`

export const BlockWrapper = ({ children, element }) => {
	const editor = useSlate()

	if (editor.isInline(element)) return children

	const showToolbar = ![ListType.LIST_ITEM, ListType.OL_LIST, ListType.UL_LIST].includes(
		element.type
	)

	return (
		<Wrapper>
			<div>{children}</div>
			{showToolbar && (
				<Toolbar
					onMouseDown={(e) => {
						// Prevent Slate errors
						e.preventDefault()
						e.stopPropagation()
					}}
				>
					{/* This element can't contain text, to prevent slate selection errors */}
					<Icon
						icon="plus"
						onMouseDown={(e) => {
							e.preventDefault()
							alert("add")
							console.log(element)
						}}
					/>
				</Toolbar>
			)}
		</Wrapper>
	)
}
