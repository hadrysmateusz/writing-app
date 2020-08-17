import React from "react"

import { SectionHeader, SectionContainer } from "./Common"
import DocumentTreeItem from "../DocumentTreeItem"
import { useMainState } from "../MainProvider"

export const FavoritesSection: React.FC = React.memo(() => {
  const { favorites } = useMainState()

  return (
    <SectionContainer>
      {favorites.length > 0 && (
        <>
          <SectionHeader>Favorites</SectionHeader>

          {favorites.map((document) => (
            <DocumentTreeItem
              key={document.id}
              depth={0}
              document={document}
              icon="starFilled"
            />
          ))}
        </>
      )}
    </SectionContainer>
  )
})
