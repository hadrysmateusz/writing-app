import React from "react"
import styled from "styled-components/macro"

export const SectionHeader: React.FC = ({ children }) => {
  return <SectionHeaderContainer>{children}</SectionHeaderContainer>
}

export const Section: React.FC<{ title: string }> = ({ children, title }) => {
  return (
    <>
      <SectionContainer>
        <SectionHeader>
          <div>{title}</div>
          {/* TODO: add a slot for buttons here */}
        </SectionHeader>
        <SectionInnerContainer>{children}</SectionInnerContainer>
        <SectionSeparator />
      </SectionContainer>
    </>
  )
}

const SectionSeparator = styled.div`
  height: 1px;
  background: #2c2c2c;
`

const SectionContainer = styled.div`
  padding: 0 20px;
`

const SectionInnerContainer = styled.div`
  padding-bottom: 16px;
`

const SectionHeaderContainer = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  letter-spacing: 0.02em;
  text-transform: uppercase;

  user-select: none;
  color: #a3a3a3;

  display: flex;
  padding-top: 16px;
  padding-bottom: 12px;
`
