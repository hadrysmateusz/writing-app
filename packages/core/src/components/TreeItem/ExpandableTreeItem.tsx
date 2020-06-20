import React, { useState, isValidElement, cloneElement, useMemo } from "react"
import styled from "styled-components/macro"
import { TreeItem } from "./TreeItem"
import Icon from "../Icon"

import {
  StatelessExpandableTreeItemProps,
  StatefulExpandableTreeItemProps,
  ExpandableChildrenRenderProps,
} from "./types"

// TODO: unify the static and expandable tree items and infer the type based on the presence and length of the childNodes prop

export const ExpandableTreeItem: React.FC<StatefulExpandableTreeItemProps> = ({
  startExpanded = false,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(startExpanded)

  return (
    <StatelessExpandableTreeItem
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      {...props}
    />
  )
}

export const StatelessExpandableTreeItem: React.FC<StatelessExpandableTreeItemProps> = ({
  icon,
  hideToggleWhenEmpty = true,
  depth = 0,
  childNodes,
  children,
  isExpanded,
  isSpecial,
  setIsExpanded,
  onBeforeExpand,
  onClick,
  onContextMenu,
}) => {
  const isEmpty = childNodes.length === 0

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

  const renderProps: ExpandableChildrenRenderProps = {
    isExpanded,
    expand,
    collapse,
    toggle,
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // TODO: better handle the onClick event handler passed in from outside
    if (onClick) {
      onClick(event)
    }
    /* Stops parent tree items from being toggled as well
    TODO: find a way to accomplish that without using stopPropagation */
    event.stopPropagation()
  }

  const handleToggleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    toggle()
    /* Stops other handlers from being triggered
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
    return !(isEmpty && hideToggleWhenEmpty)
  }, [hideToggleWhenEmpty, isEmpty])

  // TODO: save the toggled state between restarts (this will probably require making this component controlled)

  return (
    // TODO: check if the context menu listener shouldn't be placed on the tree item instead
    <OuterContainer onClick={handleClick} onContextMenu={handleContextMenu}>
      <TreeItem depth={depth} isSpecial={isSpecial}>
        <InnerContainer>
          {isCaretShown && (
            <CaretContainer onClick={handleToggleClick} isExpanded={isExpanded}>
              <Icon icon={"caretRight"} />
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

const CaretContainer = styled.div<{ isExpanded: boolean }>`
  /* margin-right: 2px; */
  margin-left: -3px;
  padding: 5px;
  padding-bottom: 0;
  position: absolute;
  left: -15px;
  font-size: 0.85em;
  border-radius: 2px;
  color: #454545;
  /* TODO: animate and improve this */
  ${(p) => p.isExpanded && "transform: rotate(90deg)"}
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
