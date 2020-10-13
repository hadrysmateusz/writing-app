import React from "react"
import iconLibrary from "./library"

const baseStyle = {
  lineHeight: "1em",
  fontSize: "1em",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

const Icon: React.FC<{
  icon: string
  color?: string
  style?: React.CSSProperties
}> = ({ icon, color, style = {}, ...rest }) => {
  const iconComponent = iconLibrary[icon]
  if (!iconComponent) console.error("invalid icon:", icon)
  return iconComponent ? (
    <div style={{ ...baseStyle, ...style, color }} {...rest}>
      {React.createElement(
        iconComponent,
        // To counteract the default display: inline-block of svg
        { style: { display: "block", paddingBottom: "1px" } },
        null
      )}
    </div>
  ) : null
}

export default Icon
