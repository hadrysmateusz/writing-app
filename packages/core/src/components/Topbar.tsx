import React, { useMemo } from "react"
import styled from "styled-components/macro"
import { useMainState } from "./MainStateProvider"
import { formatOptional } from "../utils"
import Icon from "./Icon"
import { useViewState } from "./ViewStateProvider"

export const Topbar: React.FC<{}> = () => {
  const { currentDocument } = useMainState()
  const { primarySidebar } = useViewState()

  const title = useMemo(() => {
    return currentDocument !== null
      ? formatOptional(currentDocument.title, "Untitled")
      : "Untitled"
  }, [currentDocument])

  return (
    <TopbarContainer>
      <IconContainer
        onClick={() => {
          console.log("toggling")
          primarySidebar.toggle()
        }}
      >
        <Icon icon="sidebarLeft" />
      </IconContainer>
      <TitleContainer>{title}</TitleContainer>
    </TopbarContainer>
  )
}

const IconContainer = styled.div`
  color: #6a6a6a;
  font-size: 18px;
  line-height: 18px;
  padding: 6px;
  margin: -6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;

  transition: all 100ms ease;

  &:hover {
    background-color: #353535;
    color: #b8b8b8;
  }

  &:active {
    background-color: #2a2a2a;
    color: #b8b8b8;
  }
`

const TitleContainer = styled.div`
  margin-left: 16px;
`

const TopbarContainer = styled.div`
  user-select: none;
  height: var(--topbar-height);
  width: 100%;
  padding: 10px 20px;
  border-bottom: 1px solid #363636;

  font-family: Poppins;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: #e4e4e4;
`
