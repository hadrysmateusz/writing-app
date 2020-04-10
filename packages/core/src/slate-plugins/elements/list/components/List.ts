import styled, { css } from "styled-components/macro"

const listCommon = css`
	margin: 14px 0;
	padding: 0;
	list-style-position: inside;

	li > * {
		display: inline-block;
	}
`

export const StyledUL = styled.ul`
	${listCommon}
`

export const StyledOL = styled.ol`
	${listCommon}
`
