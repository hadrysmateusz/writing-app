import React, { useEffect, useState } from "react"

import { SectionHeader, SectionContainer } from "./Common"
import DocumentTreeItem from "./DocumentTreeItem"
import { useToggleable } from "../../hooks"
import { TreeItem } from "../TreeItem"
import { DocumentDoc, useDatabase } from "../Database"

/* The number of favorites displayed without toggling */
const LIMIT_FAVORITES = 4

export const FavoritesSection: React.FC = React.memo(() => {
  const db = useDatabase()
  const [favorites, setFavorites] = useState<DocumentDoc[]>([])

  useEffect(() => {
    const sub = db.documents
      .findNotRemoved()
      .where("isFavorite")
      .eq(true)
      // .sort({ [index]: direction })
      .$.subscribe((newFavorites) => {
        setFavorites(newFavorites)
      })
    return () => sub.unsubscribe()
  }, [db.documents])

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
