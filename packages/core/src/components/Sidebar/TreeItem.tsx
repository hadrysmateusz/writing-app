import React, { useState } from "react"
import styled from "styled-components/macro"
import Icon from "../Icon"

type RenderProps = {
  isExpanded: boolean
  expand: () => void
  collapse: () => void
  toggle: () => void
}

const TreeItem: React.FC<{
  expandable?: boolean
  startExpanded?: boolean
  isRoot?: boolean
  icon?: string
  text?: string
  onBeforeExpand?: () => void
  renderStatic?: (renderProps: RenderProps) => React.ReactNode
  renderExpanded?: (renderProps: RenderProps) => React.ReactNode
}> = ({
  expandable = false,
  startExpanded = false,
  isRoot = false,
  icon,
  text = "",
  onBeforeExpand,
  renderStatic,
  renderExpanded = () => {
    throw Error("expandable TreeItem needs a renderExpanded prop")
  },
}) => {
  const [isExpanded, setIsExpanded] = useState(startExpanded)

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

  return (
    <OuterContainer>
      <MainContainer onClick={handleClick}>
        {icon && (
          <IconContainer isRoot={isRoot}>
            <Icon icon={icon} />
          </IconContainer>
        )}
        <StaticContainer>
          {renderStatic ? renderStatic(renderProps) : text}
        </StaticContainer>
      </MainContainer>
      {expandable && isExpanded && (
        <DetailsConainer>{renderExpanded(renderProps)}</DetailsConainer>
      )}
    </OuterContainer>
  )
}

const OuterContainer = styled.div``
const MainContainer = styled.div``
const StaticContainer = styled.div``
const DetailsConainer = styled.div`
  margin-left: 16px;
`
const IconContainer = styled.div<{ isRoot: boolean }>``

export default TreeItem
