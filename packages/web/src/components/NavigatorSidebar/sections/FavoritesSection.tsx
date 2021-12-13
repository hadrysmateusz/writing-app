import { memo } from "react"

import { useRxSubscription, useToggleable } from "../../../hooks"

import { GenericTreeItem } from "../../TreeItem"
import { useDatabase } from "../../Database"

import { SectionHeader, SectionContainer } from "./../Common"
import DocumentTreeItem from "../DocumentTreeItem"

/* The number of favorites displayed without toggling */
const LIMIT_FAVORITES = 4
const MSG_FAVORITES = "Favorites"
const MSG_SHOW_MORE = "Show More"
const MSG_SHOW_LESS = "Show Less"

export const FavoritesSection: React.FC = memo(() => {
  const db = useDatabase()

  const { isOpen, toggle } = useToggleable(false)
  const { data: favorites, isLoading } = useRxSubscription(
    db.documents.findNotRemoved().where("isFavorite").eq(true)
  )

  // TODO: limit the number of favorites fetched in the initial query

  const hasFavorites = !isLoading && favorites && favorites.length > 0

  return hasFavorites ? (
    <SectionContainer>
      <SectionHeader>{MSG_FAVORITES}</SectionHeader>

      {favorites.map((document, index) =>
        isOpen || index < LIMIT_FAVORITES ? (
          <DocumentTreeItem
            key={document.id}
            depth={0}
            document={document}
            icon="starFilled"
          />
        ) : null
      )}

      {favorites.length > LIMIT_FAVORITES ? (
        <GenericTreeItem
          depth={0}
          onClick={() => {
            toggle()
          }}
          icon="ellipsisHorizontal"
        >
          {isOpen ? MSG_SHOW_LESS : MSG_SHOW_MORE}
        </GenericTreeItem>
      ) : null}
    </SectionContainer>
  ) : null
})
