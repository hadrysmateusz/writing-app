import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"

import { useViewState } from "../View/ViewStateProvider"

import { SECONDARY_VIEWS } from "./types"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import { useDatabase } from "../Database"
import { useMainState } from "../MainProvider"

export const SecondarySidebar: React.FC<{}> = () => {
  const { openMenu, isMenuOpen, ContextMenu } = useContextMenu()
  const { currentDocument } = useMainState()
  const { secondarySidebar } = useViewState()
  const db = useDatabase()
  const [revs, setRevs] = useState<any[]>()

  const currentDocId = currentDocument?.id

  useEffect(() => {
    const fn = async () => {
      if (currentDocId) {
        // TODO: it should be possible to create a view/index to fetch modified dates along with these revs + pagination to save data
        const getRevs = async (docId: string) => {
          const doc = await db.documents.pouch.get(docId, {
            revs_info: true,
          })
          // TODO: error handling and validation
          return doc?._revs_info
        }

        const revs = await getRevs(currentDocId)

        if (!revs) {
          console.log("no revs")
        }

        setRevs(revs)
      }
    }

    fn()
  }, [currentDocId, currentDocument, db.documents.pouch])

  const getRev = (rev: string) => {
    if (currentDocId) {
      db.documents.pouch
        .get(currentDocId, {
          rev: rev,
        })
        .then((doc) =>
          console.log(new Date(doc?.modifiedAt).toLocaleString(), doc)
        )
    }
  }

  const handleNewSnippet = () => {
    console.warn("TODO")
  }

  const render = () => {
    switch (secondarySidebar.currentView) {
      case SECONDARY_VIEWS.SNIPPETS: {
        return (
          <Container>
            <InnerContainer onContextMenu={openMenu}>
              {revs
                ? revs.map((rev) =>
                    rev.status === "available" ? (
                      <div
                        key={rev.rev}
                        onClick={() => {
                          getRev(rev.rev)
                        }}
                      >
                        {rev.rev}
                      </div>
                    ) : null
                  )
                : "No revs"}
            </InnerContainer>

            {isMenuOpen && (
              <ContextMenu>
                <ContextMenuItem onClick={handleNewSnippet}>
                  New Snippet
                </ContextMenuItem>
              </ContextMenu>
            )}
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
  border-right: 1px solid;
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
