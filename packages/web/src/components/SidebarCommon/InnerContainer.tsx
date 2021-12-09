import React, { useCallback } from "react"
import styled from "styled-components/macro"
import { customScrollbar } from "../../style-utils"

import { ContextMenuItem, useContextMenu } from "../ContextMenu/Old"
import { useDocumentsAPI } from "../MainProvider"
import { parseSidebarPath, usePrimarySidebar } from "../ViewState"

export const InnerContainer: React.FC<{}> = ({ children }) => {
  const { createDocument } = useDocumentsAPI()
  const primarySidebar = usePrimarySidebar()

  const { openMenu, ContextMenu } = useContextMenu({
    toggleOnNestedDOMNodes: false,
  })

  const handleNewDocument = useCallback(async () => {
    const parsedSidebarPath = parseSidebarPath(
      primarySidebar.currentSubviews[primarySidebar.currentView]
    )

    if (!parsedSidebarPath) {
      return
    }

    const { view, subview, id } = parsedSidebarPath

    const createDocumentOptions = {
      switchToDocument: true,
      switchToGroup: false,
    }

    switch (view) {
      case "cloud": {
        switch (subview) {
          case "all": {
            await createDocument({ parentGroup: null }, createDocumentOptions)
            break
          }
          case "trash": {
            console.warn(
              "IMPLEMENT: option to disable creating new document from a view"
            )
            break
          }
          case "inbox": {
            await createDocument({ parentGroup: null }, createDocumentOptions)
            break
          }
          case "group": {
            await createDocument(
              { parentGroup: id ?? null },
              createDocumentOptions
            )
            break
          }
          case "tag": {
            await createDocument(
              { parentGroup: null, tags: id ? [id] : undefined },
              createDocumentOptions
            )
            break
          }
          default: {
            console.error("UNKNOWN SUBVIEW:", subview)
          }
        }
        break
      }
      case "local": {
        console.warn("IMPLEMENT: InnerContainer local new document handler")
        break
      }
      case "tags": {
        console.warn(
          "IMPLEMENT: custom context menus for views (e.g. for creating tags instead of documents"
        )
        break
      }
      default: {
        console.error("UNKNOWN VIEW:", view)
      }
    }
  }, [
    createDocument,
    primarySidebar.currentSubviews,
    primarySidebar.currentView,
  ])

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      openMenu(event)
    },
    [openMenu]
  )

  return (
    <InnerContainerSC onContextMenu={handleContextMenu}>
      {children}

      <ContextMenu>
        <ContextMenuItem onClick={handleNewDocument}>
          New Document
        </ContextMenuItem>
      </ContextMenu>
    </InnerContainerSC>
  )
}

const InnerContainerSC = styled.div`
  overflow-y: auto;

  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 40px;

  ${customScrollbar}
`
