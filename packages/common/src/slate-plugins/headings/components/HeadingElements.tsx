import styled from "styled-components"

const Heading = styled.div`
	font-weight: 600;
`

/* TODO: :not(:first-child) can't be used here to control the margin 
	because of the wrapper component, look for a different solution */

export const HeadingBig = styled(Heading)`
	margin-top: 30px;
	margin-bottom: 12px;
	font-size: 30px;
	line-height: 36px;
`

export const HeadingSmall = styled(Heading)`
	margin-top: 18px;
	margin-bottom: 6px;
	font-size: 22px;
	line-height: 28px;
`
