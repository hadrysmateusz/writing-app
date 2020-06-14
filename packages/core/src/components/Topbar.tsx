import React, { useMemo } from "react"
import styled from "styled-components/macro"
import { useMainState } from "./MainStateProvider"
import { formatOptional } from "../utils"

export const Topbar: React.FC<{}> = () => {
  const { currentDocument } = useMainState()

  const title = useMemo(() => {
    return currentDocument !== null
      ? formatOptional(currentDocument.title, "Untitled")
      : "Untitled"
  }, [currentDocument])

  return <TopbarContainer>{title}</TopbarContainer>
}

const TopbarContainer = styled.div`
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
