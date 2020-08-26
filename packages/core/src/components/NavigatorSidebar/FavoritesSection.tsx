import React from "react"

import { SectionHeader, SectionContainer } from "./Common"
import DocumentTreeItem from "../Sidebar/DocumentTreeItem"
import { useMainState } from "../MainProvider"
import { useToggleable } from "../../hooks"
import styled from "styled-components"
import { TreeItem } from "../TreeItem"

/* The number of favorites displayed without toggling */
const LIMIT_FAVORITES = 4

export const FavoritesSection: React.FC = React.memo(() => {
  const { favorites } = useMainState()
  const { isOpen, open, close } = useToggleable(false)

  // TODO: limit the number of favorites fetched in the initial query

  const favoritesInitial = favorites.slice(0, LIMIT_FAVORITES)

  const hasMore = favorites.length > LIMIT_FAVORITES

  return (
    <SectionContainer>
      {favoritesInitial.length > 0 && (
        <>
          <SectionHeader>Favorites</SectionHeader>

          {isOpen ? (
            <>
              {favorites.map((document) => (
                <DocumentTreeItem
                  key={document.id}
                  depth={0}
                  document={document}
                  icon="starFilled"
                />
              ))}
              <TreeItem
                depth={0}
                onClick={() => {
                  close()
                }}
                icon="ellipsisHorizontal"
              >
                Show less
              </TreeItem>
            </>
          ) : (
            <>
              {favoritesInitial.map((document) => (
                <DocumentTreeItem
                  key={document.id}
                  depth={0}
                  document={document}
                  icon="starFilled"
                />
              ))}
              {hasMore ?? (
                <TreeItem
                  depth={0}
                  onClick={() => {
                    open()
                  }}
                  icon="ellipsisHorizontal"
                >
                  Show More
                </TreeItem>
              )}
            </>
          )}
        </>
      )}
    </SectionContainer>
  )
})

const ToggleButton = styled(TreeItem)``
