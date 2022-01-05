import { useCallback, useMemo, useRef } from "react"
import styled from "styled-components/macro"

import { Toggleable, useOnClickOutside, useRxSubscription } from "../../hooks"

import { Autocomplete, Option } from "../Autocomplete"
import { useCloudGroupsAPI } from "../CloudGroupsProvider"
import { useDatabase } from "../Database"

export type CollectionSelectorProps = Toggleable & {
  onSubmit: (option: Option) => void
  excludeGroupIds?: (string | null)[]
  disabledGroupIds?: (string | null)[]
  inputRef: React.MutableRefObject<HTMLInputElement | null>
}

// TODO: when there are changes inside (e.g. a dirty input) force the submenu to start open (that would have to be a functionality higher up probably with this only integrating with it)
export const CollectionSelector: React.FC<CollectionSelectorProps> = ({
  onSubmit,
  close,
  isOpen,
  excludeGroupIds = [],
  disabledGroupIds = [],
  inputRef,
}) => {
  const db = useDatabase()
  const { createGroup } = useCloudGroupsAPI()

  const containerRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(containerRef, () => {
    // TODO: reset autocomplete inputValue on close (this might actually be desirable as accidental closes right now aren't exactly uncommon, I should maybe think about it again when I make the Submenu stay open while this component is dirty)
    if (isOpen) {
      close()
    }
  })

  // TODO: maybe use the global groups array and manually sort on the client
  const { data: groups } = useRxSubscription(
    // TODO: create a nameSlug for groups to avoid errors
    db.groups.find().sort({ name: "asc" })
  )

  const options = useMemo(() => {
    if (groups === null) return []

    let options: Option[] = groups.map((group) => ({
      value: group.id,
      label: group.name,
      disabled: disabledGroupIds.includes(group.id),
    }))

    options.unshift({
      value: null,
      label: "Inbox",
      disabled: disabledGroupIds.includes(null),
    })

    // Exclude specified groups
    options = options.filter(
      (option) => !excludeGroupIds.includes(option.value)
    )

    return options
  }, [disabledGroupIds, excludeGroupIds, groups])

  const handleMoveToGroupCreate = useCallback(
    async (value: string) => {
      const newGroup = await createGroup(null, { name: value })
      onSubmit({ value: newGroup.id, label: value })
    },
    [createGroup, onSubmit]
  )

  return (
    <CollectionSelectorContainer ref={containerRef}>
      <Autocomplete
        suggestions={options}
        submit={onSubmit}
        close={close}
        create={handleMoveToGroupCreate}
        submitPrompt="Press 'Enter' to confirm selection"
        createNewPrompt="Press 'Enter' to create new collection"
        inputRef={inputRef}
      />
    </CollectionSelectorContainer>
  )
}

export default CollectionSelector

const CollectionSelectorContainer = styled.div`
  width: 225px;
  padding: 0 6px;
`
