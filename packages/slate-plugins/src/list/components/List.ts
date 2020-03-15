import styled, { css } from "styled-components/macro"

const listCommon = css`
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
