import { useEffect, useRef, useState } from "react"
import styled from "styled-components/macro"

import {
  useOnClickOutside,
  useRxSubscription,
  useToggleable,
} from "../../hooks"

import { Autocomplete, Option } from "../Autocomplete"
import { useDatabase } from "../Database"
import { useTabsState } from "../TabsProvider"

export const CollectionSelector = ({
  onSubmit,
}: {
  onSubmit: (option: Option) => void
}) => {
  const db = useDatabase()
  const { currentDocumentId } = useTabsState()

  const { data: groups } = useRxSubscription(
    // TODO: create a nameSlug for groups to avoid errors
    db.groups.find().sort({ name: "asc" })
  )

  const { data: currentDocument } = useRxSubscription(
    db.documents.findOne().where("id").eq(currentDocumentId)
  )

  const [options, setOptions] = useState<Option[]>([])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const autocompleteInputRef = useRef<HTMLInputElement | null>(null)

  const { isOpen, close } = useToggleable(true, {
    onAfterOpen: () => {
      console.dir("after open", autocompleteInputRef?.current)
      // setTimeout is important for this to work
      setTimeout(() => {
        autocompleteInputRef?.current?.focus()
      }, 0)
    },
  })

  useOnClickOutside(containerRef, () => {
    // TODO: reset autocomplete inputValue on close
    if (isOpen) {
      close()
    }
  })

  useEffect(() => {
    if (groups === null) return
    if (currentDocument === null) return

    setOptions(
      groups
        .map((group) => ({ value: group.id, label: group.name }))
        .filter((tagOption) => currentDocument.parentGroup !== tagOption.value)
    )
  }, [currentDocument, groups])

  return (
    <CollectionSelectorContainer>
      <Autocomplete
        ref={autocompleteInputRef}
        suggestions={options}
        submit={onSubmit}
        placeholder="Search"
      />
    </CollectionSelectorContainer>
  )
}

export default CollectionSelector

const CollectionSelectorContainer = styled.div`
  width: 220px;
  padding: 0 6px;
`
