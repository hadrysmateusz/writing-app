import { useState } from "react"
import styled from "styled-components/macro"

import { useStatelessToggleable } from "../../hooks"

import { Icon } from "../Icon"

import {
  StatelessExpandableTreeItemProps,
  StatefulExpandableTreeItemProps,
  ExpandableChildrenRenderProps,
} from "./types"
import { TreeItemIcon } from "./TreeItemIcon"
import { TreeItem } from "./TreeItem"

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

export const StatelessExpandableTreeItem: React.FC<
  StatelessExpandableTreeItemProps
> = ({
  icon,
  depth = 0,
  children,
  isExpanded,
  isSpecial,
  isActive,
  nested,
  setIsExpanded,
  onClick,
  onContextMenu,
  // Toggleable hooks
  onBeforeChange,
  onAfterChange,
  ...rest
}) => {
  const {
    toggle,
    open: expand,
    close: collapse,
  } = useStatelessToggleable(isExpanded, setIsExpanded, {
    onBeforeChange,
    onAfterChange,
  })

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

  const handleToggle = (event: React.MouseEvent<HTMLDivElement>) => {
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

  return (
    <OuterContainer onClick={handleClick} onContextMenu={handleContextMenu}>
      <TreeItem
        depth={depth}
        isSpecial={isSpecial}
        isActive={isActive}
        {...rest}
      >
        <InnerContainer>
          <CaretContainer isExpanded={isExpanded} onClick={handleToggle}>
            <Icon icon={"caretRight"} />
          </CaretContainer>
          <TreeItemIcon icon={icon} style={{ marginBottom: "-3px" }} />
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

const CaretContainer = styled.div<{ isExpanded: boolean }>`
  padding: 8px;
  position: absolute;
  top: -3px;
  left: -23px;

  font-size: 0.85em;
  color: var(--dark-500);

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
