import React, { useState, isValidElement, cloneElement } from "react"
import styled from "styled-components/macro"
import TreeItem from "./TreeItem"

type RenderProps = {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
  toggle: () => void
}

// TODO: unify the static and expandable tree items and infer the type based on the presence and length of the childNodes prop
const ExpandableTreeItem: React.FC<{
  icon?: string
  startExpanded?: boolean
  depth?: number
  childNodes: React.ReactNode[]
  onBeforeExpand?: () => void
  // TODO: allow any react event handlers and other common props to pass through
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void
}> = ({
  icon,
  startExpanded = false,
  depth = 0,
  childNodes,
  children,
  onBeforeExpand,
  onClick,
  onContextMenu,
}) => {
  const isEmpty = childNodes.length === 0
  const [isExpanded, setIsExpanded] = useState(startExpanded)

  const expand = () => {
    onBeforeExpand && onBeforeExpand()
    setIsExpanded(true)
  }

  const collapse = () => setIsExpanded(false)

  const toggle = () => {
    // The abstraction functions are used to make sure any and all pre-hooks are fired
    if (isExpanded) {
      collapse()
    } else {
      expand()
    }
  }

  const renderProps: RenderProps = { isExpanded, expand, collapse, toggle }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // TODO: better handle the onClick event handler passed in from outside
    if (onClick) {
      onClick(event)
    }
    toggle()
  }

  const childrenWithProps = childNodes.map((child) => {
    // Checking isValidElement is the safe way and avoids a TS error too.
    if (isValidElement(child)) {
      return cloneElement(child, { depth: depth + 1 })
    }

    return child
  })

  return (
    <OuterContainer depth={depth}>
      {/* TODO: add a chevron to indicate that the item is collapsible/expandable */}

      <TreeItem
        depth={depth}
        icon={icon}
        onClick={handleClick}
        onContextMenu={onContextMenu}
      >
        {typeof children === "function" ? children(renderProps) : children}
      </TreeItem>

      {isExpanded && !isEmpty && (
        <DetailsContainer>{childrenWithProps}</DetailsContainer>
      )}
    </OuterContainer>
  )
}

const OuterContainer = styled.div<{ depth: number }>``

const DetailsContainer = styled.div`
  margin-top: 2px;
  margin-bottom: 8px; /* bottom is intentionally larger than top */
`

export default ExpandableTreeItem
