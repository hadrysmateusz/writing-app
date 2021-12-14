import { useEffect, useRef, useState } from "react"
import styled from "styled-components/macro"

import {
  useOnClickOutside,
  useRxSubscription,
  useToggleable,
} from "../../hooks"

import { Autocomplete, Option } from "../Autocomplete"
import { useDatabase } from "../Database"
// import { useTabsState } from "../TabsProvider"

export const CollectionSelector = ({
  onSubmit,
}: {
  onSubmit: (option: Option) => void
}) => {
  const db = useDatabase()
  // const { currentCloudDocument } = useTabsState()

  // TODO: maybe use the global groups array and manually sort on the client
  const { data: groups } = useRxSubscription(
    // TODO: create a nameSlug for groups to avoid errors
    db.groups.find().sort({ name: "asc" })
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

    let options = groups.map((group) => ({
      value: group.id,
      label: group.name,
    }))

    // TODO: only re-enable this when I add a way for this component to know if it's used on the current document or any other
    // // If there is a currentCloudDocument filter out its parentGroup
    // if (currentCloudDocument !== null) {
    //   options = options.filter(
    //     (tagOption) => currentCloudDocument.parentGroup !== tagOption.value
    //   )
    // }

    setOptions(options)
  }, [groups])

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
