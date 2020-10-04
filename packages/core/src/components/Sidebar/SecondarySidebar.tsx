import React from "react"
import styled from "styled-components/macro"

import { useViewState } from "../View/ViewStateProvider"

import { ContextMenuItem, useContextMenu } from "../ContextMenu"

import { SECONDARY_VIEWS } from "../../constants"
import { Outline } from "./Outline"
import TextStats from "../TextStats"
import { Section } from "./common"

export const SecondarySidebar: React.FC<{}> = () => {
  const { openMenu, ContextMenu } = useContextMenu()
  const { secondarySidebar } = useViewState()

  const handleNewSnippet = () => {
    console.warn("TODO")
  }

  const render = () => {
    switch (secondarySidebar.currentView) {
      case SECONDARY_VIEWS.SNIPPETS: {
        return (
          <Container>
            <InnerContainer onContextMenu={openMenu}>
              <Section title="Progress">
                <div>
                  <TextStats />
                </div>
              </Section>

              <Section title="Keywords">
                <div></div>
              </Section>

              <Section title="Outline">
                <div>
                  <Outline />
                </div>
              </Section>
            </InnerContainer>

            <ContextMenu>
              <ContextMenuItem onClick={handleNewSnippet}>
                New Snippet
              </ContextMenuItem>
            </ContextMenu>
          </Container>
        )
      }
      default: {
        throw new Error(`Unknown view type: ${secondarySidebar.currentView}`)
      }
    }
  }

  return <OuterContainer>{render()}</OuterContainer>
}

const OuterContainer = styled.div`
  min-height: 0;
  height: 100%;
  border-left: 1px solid;
  border-color: #363636;
  background-color: #1e1e1e;
  position: relative;
`

const Container = styled.div`
  min-height: 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr min-content;
`

const InnerContainer = styled.div`
  overflow-y: auto;
`

// const NewButton = styled.div`
//   font-family: poppins;
//   font-weight: 500;
//   font-size: 13px;
//   color: #e4e4e4;
//   background: #1e1e1e;
//   user-select: none;
//   border-top: 1px solid #363636;
//   width: 100%;
//   padding: 12px 20px;
//   display: block;
//   cursor: pointer;
//   :hover {
//     color: white;
//   }
// `
