import React, { useState, FC } from "react"
import styled from "styled-components/macro"
import { TreeItem } from "./TreeItem"
import Icon from "../Icon"

import {
  StatelessExpandableTreeItemProps,
  StatefulExpandableTreeItemProps,
  ExpandableChildrenRenderProps,
} from "./types"
import { useStatelessToggleable } from "../../hooks"

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
    depth = 0,
    nested,
    children,
    isExpanded,
    isSpecial,
    isActive,
    setIsExpanded,
    onClick,
    onContextMenu,
    // Toggleable hooks
    onBeforeChange,
    onAfterChange,
  } = props

  const { toggle, open: expand, close: collapse } = useStatelessToggleable(
    isExpanded,
    setIsExpanded,
    {
      onBeforeChange,
      onAfterChange,
    }
  )

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

  // TODO: save the toggled state between restarts (this will probably require making this component controlled)

  const isRoot = depth === 0

  return (
    // TODO: check if the context menu listener shouldn't be placed on the tree item instead
    <OuterContainer onClick={handleClick} onContextMenu={handleContextMenu}>
      <TreeItem depth={depth} isSpecial={isSpecial} isActive={isActive}>
        <InnerContainer>
          <CaretContainer isExpanded={isExpanded}>
            <Icon icon={"caretRight"} />
          </CaretContainer>
          {/* TODO: de-duplicated the icon code with the one in TreeItem */}
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
        <DetailsContainer>{nested(depth + 1)}</DetailsContainer>
      ) : null}
    </OuterContainer>
  )
}

const OuterContainer = styled.div`
  width: 100%;
  :focus {
    border: none;
    outline: none;
  }
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
