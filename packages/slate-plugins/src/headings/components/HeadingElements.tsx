import styled from "styled-components"

const Heading = styled.div`
	font-weight: 600;
`

export const HeadingBig = styled(Heading)`
	:not(:first-child) {
		margin-top: 30px;
	}
	margin-bottom: 12px;
	font-size: 30px;
	line-height: 36px;
`

export const HeadingSmall = styled(Heading)`
	:not(:first-child) {
		margin-top: 18px;
	}
	margin-bottom: 6px;
	font-size: 22px;
	line-height: 28px;
`
