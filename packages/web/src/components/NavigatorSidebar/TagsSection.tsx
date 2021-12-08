import { useCallback, useMemo } from "react"

import { useRxSubscription, useToggleable } from "../../hooks"

import { DocumentDoc, TagDoc, useDatabase } from "../Database"
import { GenericTreeItem } from "../TreeItem"
import { EditableText, useEditableText } from "../RenamingInput"
import { ContextMenuItem, useContextMenu } from "../ContextMenu"
import { useTagsAPI } from "../MainProvider/context"
import { parseSidebarPath, usePrimarySidebar } from "../ViewState"

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

const TagTreeItem: React.FC<{ tagId: string; tagName: string }> = ({
  tagId,
  tagName,
}) => {
  const { actuallyPermanentlyDeleteTag, renameTag } = useTagsAPI()
  const { switchSubview, currentSubviews, currentView } = usePrimarySidebar()

  const { openMenu, closeMenu, ContextMenu } = useContextMenu()

  const { startRenaming, getProps: getRenamingInputProps } = useEditableText(
    tagName,
    (value: string) => {
      renameTag(tagId, value)
    }
  )

  const handleRename = useCallback(() => {
    closeMenu()
    startRenaming()
  }, [closeMenu, startRenaming])

  const handleDelete = useCallback(async () => {
    // TODO: add a confirmation dialog
    try {
      await actuallyPermanentlyDeleteTag(tagId)
    } catch (e) {
      // TODO: better surface this error to the user
      console.log("error while deleting tag")
      throw e
    }
  }, [actuallyPermanentlyDeleteTag, tagId])

  const handleClick = useCallback(() => {
    switchSubview("cloud", "tag", tagId)
  }, [switchSubview, tagId])

  const isActive = parseSidebarPath(currentSubviews[currentView])?.id === tagId

  return (
    <>
      <GenericTreeItem
        key={tagId}
        depth={0}
        onContextMenu={openMenu}
        onClick={handleClick}
        isActive={isActive}
        icon="tag"
      >
        <EditableText {...getRenamingInputProps()}>{tagName}</EditableText>
      </GenericTreeItem>

      <ContextMenu>
        <ContextMenuItem onClick={handleRename}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
      </ContextMenu>
    </>
  )
}

export default TagsSection
