import React from "react"

// TODO: consider other value types and maybe even comparing values with functions and even multiple values to be compared

export const Switch: React.FC<{ value: string }> = ({ value, children }) => {
  let element: React.ReactElement | undefined
  let defaultElement: React.ReactElement | undefined

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    const { value: childValue, default: isDefault } = child.props

    if (isDefault) {
      defaultElement = child
      return
    }

    if (childValue === value) {
      element = child
      return
    }
  })

  return element ?? defaultElement ?? null
}

export const Case: React.FC<{
  component?: React.ReactElement
  value?: string
  default?: boolean
}> = ({ component, children }) => {
  return component ?? <>{children}</> ?? null
}

// TODO: needs to be fixed - because the case is nested inside this component, React.Children.forEach doesn't see the 'default' prop on this child. Maybe use the componentName or something
export const Default: React.FC<{
  component: React.ReactElement
}> = ({ component }) => {
  return <Case default component={component} />
}
