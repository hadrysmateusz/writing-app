import React from "react"

const Button: React.FC<{ active }> = ({ active, ...props }) => {
	// this styling only works when the svg has fill & stroke set to "currentColor" and all fills and paths are removed from the paths inside it
	return <button style={{ color: active ? "green" : "black" }} {...props} />
}

export default Button
