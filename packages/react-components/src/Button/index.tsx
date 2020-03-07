import React from "react"
import styled from "styled-components/macro"

const StyledButton = styled.button`
	background: none;
	border: none;
	border-radius: none;
	padding: 6px;
	color: ${(p) => (p.active ? "#1885d8" : "#2a2a2a")};
`

const Button: React.FC<{ active }> = ({ active, ...props }) => {
	// this styling only works when the svg has fill & stroke set to "currentColor" and all fills and paths are removed from the paths inside it
	return <StyledButton active={active} {...props} />
}

export default Button
