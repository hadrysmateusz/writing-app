import { useRxSubscription } from "../../../hooks"
import { useDatabase } from "../../Database"

import {
  TagAltContainer,
  TagsContainer,
} from "./SidebarDocumentItemTagsList.styles"

// TODO: expose a list of all tags through context to reduce queries/subscriptions across the app
export const TagsList: React.FC<{ tags: string[] }> = ({ tags }) => {
  const db = useDatabase()
  const { data: allTags } = useRxSubscription(db.tags.find())

  return allTags ? (
    <TagsContainer>
      {tags.map((tagId) => (
        <TagAlt key={tagId}>
          {allTags.find((tag) => tag.id === tagId)?.name || "..."}
        </TagAlt>
      ))}
    </TagsContainer>
  ) : null
}

export const TagAlt: React.FC = ({ children }) => {
  return <TagAltContainer>{children}</TagAltContainer>
}
