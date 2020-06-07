import React from "react"
import iconLibrary from "./library"

const Icon: React.FC<{ icon: string }> = ({ icon, ...rest }) => {
  const iconComponent = iconLibrary[icon]
  if (!iconComponent) console.error("invalid icon:", icon)
  return iconComponent ? (
    <div {...rest}>{React.createElement(iconComponent, null, null)}</div>
  ) : null
}

export default Icon
