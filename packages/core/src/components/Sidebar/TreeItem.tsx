import React, { useState } from "react"
import styled from "styled-components/macro"
import Icon from "../Icon"

type RenderProps = {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
  toggle: () => void
}

/* TODO: abstract and refactor into multiple components: 
  - one for a generic collapsible component with no assumptions about its render output
  - one for a static tree item that can't be expanded and takes simplified props
  - one for an expandable tree item that will automatically handle rendering a list of children and assigning them their depth
*/

const TreeItem: React.FC<{
  icon?: string
  expandable?: boolean
  startExpanded?: boolean
  depth?: number
  text?: string
  onBeforeExpand?: () => void
  renderStatic?: (renderProps: RenderProps) => React.ReactNode
  renderExpanded?: (renderProps: RenderProps) => React.ReactNode
}> = ({
  icon,
  expandable = false,
  startExpanded = false,
  depth = 0,
  text = "",
  onBeforeExpand,
  renderStatic,
  renderExpanded,
}) => {
  const isRoot = depth === 0
  const [isExpanded, setIsExpanded] = useState(startExpanded)

  if (expandable && !renderExpanded) {
    throw new Error("Expandable TreeItem needs a renderExpanded prop")
  }

  const handleClick = (_event: React.MouseEvent<HTMLDivElement>) => {
    // If the renderStatic prop is provided don't automatically open on click
    if (renderStatic) return
    toggle()
  }

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

  // TODO: add a chevron to indicate that the item is collapsible/expandable

  return (
    <OuterContainer depth={depth}>
      <MainContainer onClick={handleClick}>
        {icon && (
          <IconContainer isRoot={isRoot}>
            <Icon icon={icon} />
          </IconContainer>
        )}
        <StaticContainer isRoot={isRoot}>
          {renderStatic ? renderStatic(renderProps) : text}
        </StaticContainer>
      </MainContainer>
      {expandable && isExpanded && (
        <DetailsContainer>
          {renderExpanded && renderExpanded(renderProps)}
        </DetailsContainer>
      )}
    </OuterContainer>
  )
}

const OuterContainer = styled.div<{ depth: number }>`
  margin-left: ${(p) => p.depth * 16}px;
`
const MainContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  user-select: none;
  /* margin: 10px 0; */
`
const StaticContainer = styled.div<{ isRoot: boolean }>`
  font-family: "Segoe UI"; /* TODO: create global font-stacks */
  font-size: 12px;
  /* font-size: ${(p) => (p.isRoot ? "12px" : "11px")}; */
  color: ${(p) => (p.isRoot ? "#f2f2f2" : "#f0f0f0")};
  font-weight: ${(p) => (p.isRoot ? "bold" : "normal")};
  text-rendering: optimizeLegibility;
  letter-spacing: 0.02em;
  padding: 5px 0;
  :hover { 
    color: white;
  }
`
const DetailsContainer = styled.div`
  /* margin-left: 16px; */
  margin-top: 2px;
  margin-bottom: 8px; /* bottom is intentionally larger than top */
`
const IconContainer = styled.div<{ isRoot: boolean }>`
  /* padding: 0 8px; */
  margin-right: 8px;
  margin-bottom: -4px; /* to help align the icon with the text */
  color: ${(p) => (p.isRoot ? "#858585" : "#5D5D5D")};
  font-size: 1.4em;
`

export default TreeItem
