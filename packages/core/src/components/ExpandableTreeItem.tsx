import React, { useState, isValidElement, cloneElement, useMemo } from "react"
import styled from "styled-components/macro"
import TreeItem from "./TreeItem"
import Icon from "./Icon"

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
    /* Stops parent tree items from being toggled as well
    TODO: find a way to accomplish that without using stopPropagation */
    event.stopPropagation()
  }

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onContextMenu) {
      onContextMenu(event)
      event.stopPropagation()
    }
  }

  const childrenWithProps = childNodes.map((child) => {
    // Checking isValidElement is the safe way and avoids a TS error too.
    if (isValidElement(child)) {
      return cloneElement(child, { depth: depth + 1 })
    }

    return child
  })

  const isCaretShown = useMemo(() => {
    // TODO: add some conditional rendering and props for manual control
    return true
  }, [])

  // TODO: make the hover styles render consistently

  return (
    <OuterContainer onClick={handleClick} onContextMenu={handleContextMenu}>
      <TreeItem depth={depth}>
        <InnerContainer>
          {isCaretShown && (
            <CaretContainer>
              <Icon
                icon={isExpanded ? "caretDown" : "caretRight"}
                color="#414141"
              />
            </CaretContainer>
          )}
          {icon && (
            <IconContainer isRoot={depth === 0}>
              <Icon icon={icon} />
            </IconContainer>
          )}
          {typeof children === "function" ? children(renderProps) : children}
        </InnerContainer>
      </TreeItem>

      {isExpanded && !isEmpty && (
        <DetailsContainer>{childrenWithProps}</DetailsContainer>
      )}
    </OuterContainer>
  )
}

const OuterContainer = styled.div``

const IconContainer = styled.div<{ isRoot: boolean }>`
  margin-right: 8px;
  margin-bottom: -4px; /* to help align the icon with the text */
  color: ${(p) => (p.isRoot ? "#858585" : "#5D5D5D")};
  font-size: 1.4em;
`

const CaretContainer = styled.div`
  margin-right: 5px;
  position: absolute;
  top: 3px;
  left: -15px;
  font-size: 0.85em;
`

const InnerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const DetailsContainer = styled.div`
  margin-top: 2px;
  margin-bottom: 8px; /* bottom is intentionally larger than top */
`

export default ExpandableTreeItem
