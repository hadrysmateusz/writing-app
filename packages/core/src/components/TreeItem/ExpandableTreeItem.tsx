import React, {
  useState,
  isValidElement,
  cloneElement,
  useMemo,
  FC,
} from "react"
import styled from "styled-components/macro"
import { TreeItem } from "./TreeItem"
import Icon from "../Icon"

import {
  StatelessExpandableTreeItemProps,
  StatefulExpandableTreeItemProps,
  ExpandableChildrenRenderProps,
} from "./types"
import Ellipsis from "../Ellipsis"

// TODO: unify the static and expandable tree items and infer the type based on the presence and length of the childNodes prop

export const ExpandableTreeItem: FC<StatefulExpandableTreeItemProps> = ({
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

export const StatelessExpandableTreeItem: FC<StatelessExpandableTreeItemProps> = (
  props
) => {
  const {
    icon,
    hideToggleWhenEmpty = false,
    depth = 0,
    childNodes,
    children,
    isExpanded,
    isSpecial,
    isActive,
    setIsExpanded,
    onBeforeExpand,
    onClick,
    onContextMenu,
  } = props

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
  const isRoot = depth === 0

  return (
    // TODO: check if the context menu listener shouldn't be placed on the tree item instead
    <OuterContainer onClick={handleClick} onContextMenu={handleContextMenu}>
      <TreeItem depth={depth} isSpecial={isSpecial} isActive={isActive}>
        <InnerContainer>
          {isCaretShown && (
            <CaretContainer onClick={handleToggleClick} isExpanded={isExpanded}>
              <Icon icon={"caretRight"} />
            </CaretContainer>
          )}
          {icon && (
            <IconContainer isRoot={isRoot}>
              <Icon icon={icon} />
            </IconContainer>
          )}
          <ChildrenContainer>
            {typeof children === "function" ? children(renderProps) : children}
          </ChildrenContainer>
        </InnerContainer>
      </TreeItem>

      {isExpanded ? (
        isEmpty ? (
          <TreeItem depth={depth + 1} disabled>
            <Ellipsis>No Nested Collections</Ellipsis>
          </TreeItem>
        ) : (
          <DetailsContainer>{childrenWithProps}</DetailsContainer>
        )
      ) : null}
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  width: 100%;
`

const ChildrenContainer = styled.div`
  width: 100%;
  display: flex;
  min-width: 0;
  align-items: center;
`

const IconContainer = styled.div<{ isRoot: boolean; isHidden?: boolean }>`
  margin-right: 8px;
  margin-bottom: -4px; /* to help align the icon with the text */
  color: ${(p) => (p.isRoot ? "#858585" : "#5D5D5D")};
  font-size: 1.4em;
  ${(p) => p.isHidden === true && `opacity: 0;`}
`

const CaretContainer = styled.div<{ isExpanded: boolean }>`
  padding: 8px;
  position: absolute;
  top: -3px;
  left: -23px;

  font-size: 0.85em;
  color: #454545;

  transition: transform 100ms ease-out;
  transform-origin: center;
  ${(p) => p.isExpanded && "transform: rotate(90deg)"}
`

const InnerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`

const DetailsContainer = styled.div``

export default ExpandableTreeItem
