import React from "react"
import iconLibrary from "./library"

const Icon: React.FC<{
  icon: string
  color?: string
  style?: React.CSSProperties
}> = ({ icon, color, style = {}, ...rest }) => {
  const iconComponent = iconLibrary[icon]
  if (!iconComponent) console.error("invalid icon:", icon)
  return iconComponent ? (
    <div style={{ ...style, color }} {...rest}>
      {React.createElement(iconComponent, null, null)}
    </div>
  ) : null
}

export default Icon
