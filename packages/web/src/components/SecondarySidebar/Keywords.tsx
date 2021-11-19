import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"

import { useRxSubscription } from "../../hooks"

import { TagDoc, TagDocType, useDatabase } from "../Database"
import { useDocumentsAPI, useMainState, useTagsAPI } from "../MainProvider"

type options = Pick<TagDocType, "id" | "name">[]

const Keywords = () => {
  const db = useDatabase()
  const [selectValue, setSelectValue] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState<string>("")
  const { updateDocument } = useDocumentsAPI()
  const { currentDocumentId } = useMainState()
  const { createTag } = useTagsAPI()
  const [options, setOptions] = useState<options>([])

  const { data: tags } = useRxSubscription(
    db.tags.find().sort({ nameSlug: "desc" })
  )

  const { data: currentDocument } = useRxSubscription(
    db.documents.findOne().where("id").eq(currentDocumentId)
  )

  const handleInputChange = (event) => {
    console.log("changing value of input to", event.target.value)
    setInputValue(event.target.value)
  }

  const handleSelectChange = (event) => {
    console.log("changing value of select to", event.target.value)
    setSelectValue(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (currentDocument !== null) {
      const trimmedInputValue = inputValue.trim()

      const oldTags = currentDocument.tags

      ;(async () => {
        if (trimmedInputValue !== "") {
          if (!oldTags.includes(trimmedInputValue)) {
            const newTag = await createTag({ name: trimmedInputValue })

            if (newTag === null) {
              return
            }

            await updateDocument(currentDocument.id, {
              tags: [...oldTags, newTag.id],
            })
          } else {
            return
          }
        }

        if (selectValue !== null) {
          if (!oldTags.includes(selectValue)) {
            await updateDocument(currentDocument.id, {
              tags: [...oldTags, selectValue],
            })
          } else {
            return
          }
        }
      })()

      setInputValue("")

      console.warn("invalid scenario")
    }
  }

  // TODO: after adding tag make sure selectValue in state actually matches what's displayed and is available in tagOptions

  useEffect(() => {
    if (tags === null) return
    if (currentDocument === null) return

    setOptions(
      tags
        .map((tag) => ({ id: tag.id, name: tag.name }))
        .filter((tagOption) => !currentDocument.tags.includes(tagOption.id))
    )
  }, [currentDocument, tags])

  useEffect(() => {
    if (selectValue !== null) return
    if (tags && tags.length > 0) {
      setSelectValue(tags[0].id)
    }
  }, [selectValue, tags])

  const isReady = currentDocumentId !== null && selectValue !== null && tags

  console.log("tag options", options)
  console.log("select value", selectValue)

  return (
    <div>
      {isReady ? (
        <form onSubmit={handleSubmit}>
          <select value={selectValue} onChange={handleSelectChange}>
            {options.map((tagOption) => (
              <option key={tagOption.id} value={tagOption.id}>
                {tagOption.name}
              </option>
            ))}
          </select>
          <input value={inputValue} onChange={handleInputChange} />
          <button type="submit">+</button>
        </form>
      ) : (
        "No tags"
      )}
      <TagsList />
    </div>
  )
}

const TagsList = () => {
  const db = useDatabase()
  const { currentDocumentId } = useMainState()
  const [tagsOnDoc, setTagsOnDoc] = useState<TagDoc[]>([])

  const { data: tags } = useRxSubscription(
    db.tags.find().sort({ nameSlug: "desc" })
  )

  const { data: currentDocument } = useRxSubscription(
    db.documents.findOne().where("id").eq(currentDocumentId)
  )

  useEffect(() => {
    console.log("currentDocument", currentDocument)

    if (currentDocument !== null && tags !== null) {
      console.log("updating matching tags list")
      const matchingTags: TagDoc[] = []
      currentDocument.tags.forEach((tagId) => {
        const tag = tags.find((tag) => tag.id === tagId)
        if (tag) {
          matchingTags.push(tag)
        }
      })
      setTagsOnDoc(matchingTags)
    }
  }, [currentDocument, tags])

  return (
    <TagsContainer>
      {currentDocument !== null
        ? tagsOnDoc.map((tag) => (
            <TagSmall key={tag.id} tagId={tag.id}>
              {tag.name}
            </TagSmall>
          ))
        : null}
    </TagsContainer>
  )
}

const TagSmall: React.FC<{ tagId: string }> = ({ children, tagId }) => {
  const { updateDocument } = useDocumentsAPI()
  const { currentDocumentId } = useMainState()
  // const db = useDatabase()

  const removeTag = async (id: string) => {
    if (currentDocumentId !== null) {
      await updateDocument(currentDocumentId, (original) => ({
        tags: original.tags.filter((tagId) => tagId !== id),
      }))
    }
  }

  return (
    <TagSmallStyled
      onClick={async (e) => {
        removeTag(tagId)
        // const docsWithTag = await db.documents
        //   .find({
        //     selector: {
        //       $and: [
        //         {
        //           tags: {
        //             $elemMatch: { $eq: tagId },
        //           },
        //         },
        //         {
        //           isDeleted: {
        //             $eq: false,
        //           },
        //         },
        //       ],
        //     },
        //   })
        //   .exec()
        // console.log(
        //   `docsWithTag: ${tagId}`,
        //   docsWithTag.map((doc) => doc.toJSON())
        // )
      }}
    >
      {children}
    </TagSmallStyled>
  )
}

const TagsContainer = styled.div`
  margin: 16px 0;

  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

const TagSmallStyled = styled.div`
  cursor: pointer;

  padding: 3px 6px;
  border: 1px solid;

  font-size: 11px;

  color: var(--light-500);
  background-color: var(--dark-500);
  border-color: var(--dark-600);
  border-radius: 2px;

  :hover {
    color: var(--light-600);
    background-color: var(--dark-600);
    border-color: var(--dark-600);
  }
`

export default Keywords
