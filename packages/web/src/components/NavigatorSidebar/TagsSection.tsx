import { useMemo } from "react"

import { useRxSubscription, useToggleable } from "../../hooks"

import { DocumentDoc, TagDoc, useDatabase } from "../Database"
import { TagTreeItem } from "../TagTreeItem"
import { GenericTreeItem } from "../TreeItem"
import { usePrimarySidebar } from "../ViewState"

import { SectionHeader, SectionContainer } from "./Common"

function countTaggedDocs(tags: TagDoc[], documents: DocumentDoc[]) {
  // simplify tag docs to only the necessary data and add a docCount field for later
  const newTags = tags.map((tag) => ({ ...tag.toJSON(), docCount: 0 }))
  // iterate over all docs and count the number of occurences of each tag
  const tagsCounter = {}
  documents.forEach((doc) => {
    doc.tags.forEach((tagOnDoc) => {
      // if tagId is already present on object increment its count, otherwise initialize it to 0
      if (tagsCounter[tagOnDoc] === undefined) {
        tagsCounter[tagOnDoc] = 0
      } else {
        tagsCounter[tagOnDoc] += 1
      }
    })
  })
  // assign docCount to each tag in array
  newTags.forEach((tag) => {
    tag.docCount = tagsCounter[tag.id]
  })
  // sort tags array by docCount ASC
  newTags.sort((a, b) => b.docCount - a.docCount)
  return newTags
}

/* The number of tags displayed without toggling */
const LIMIT_TAGS = 4
const MSG_TAGS_HEADER = "Tags"
const MSG_SHOW_MORE = "Show More"
const MSG_SHOW_LESS = "Show Less"
export const TagsSection: React.FC = () => {
  const db = useDatabase()

  const { isOpen, toggle } = useToggleable(false)

  const { data: tags } = useRxSubscription(db.tags.find())
  const { data: documents } = useRxSubscription(db.documents.findNotRemoved())

  const numTags: number = tags?.length ?? 0
  const hasTags: boolean = numTags > 0

  const sortedTags = useMemo(() => {
    if (!tags || !documents) return null
    return countTaggedDocs(tags, documents)
  }, [documents, tags])

  const isReady = hasTags && sortedTags

  return isReady ? (
    <SectionContainer>
      <TagsSectionHeader />

      {sortedTags.map((tag, index) =>
        isOpen || index < LIMIT_TAGS ? (
          <TagTreeItem key={tag.id} tagId={tag.id} tagName={tag.name} />
        ) : null
      )}

      {numTags > LIMIT_TAGS ? (
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
}

const TagsSectionHeader = () => {
  const primarySidebar = usePrimarySidebar()

  const handleClick = (_e) => {
    primarySidebar.switchSubview("tags", "all")
  }

  return (
    <SectionHeader withHover={true} onClick={handleClick}>
      {MSG_TAGS_HEADER}
    </SectionHeader>
  )
}

export default TagsSection
