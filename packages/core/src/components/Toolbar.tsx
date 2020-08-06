import React, { useState, useCallback, useMemo } from "react"
import { Range } from "slate"
import { useSlate, ReactEditor } from "slate-react"
import styled from "styled-components/macro"

import {
  BLOCKQUOTE,
  CODE_BLOCK,
  HeadingType,
  toggleList,
  insertHorizontalRule,
  HORIZONTAL_RULE,
  IMAGE,
} from "../slate-plugins"
import { ImageModalContent } from "./ImageModal"
import { ListType } from "../slateTypes"
import FormatButton from "./FormatButton"
import { useModal } from "./Modal"

const ToolbarContainer = styled.div`
  color: "#afb3b6";
`

const Section = styled.div`
  display: inline-block;
  &:not(:last-child) {
    margin-right: 20px;
  }
`

export const Toolbar = () => {
  const editor = useSlate()
  const [selection, setSelection] = useState<Range | null>(null)
  const {
    open: openImageModal,
    close: closeImageModal,
    Modal: ImageModal,
  } = useModal(false)

  const onInsertHorizontalRule = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      insertHorizontalRule(editor)
    },
    [editor]
  )

  const onInsertImage = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      // TODO: save selection state (perhaps override apply and everyone a "set_selection" operation with {newProperties: null} is applied, save the selection (but it's so low-level that I don't know where to store and how to restore it, so maybe a wrapper function will be required (I could store it in local storage, but that might have issues between restarts)))
      setSelection(editor.selection)
      ReactEditor.deselect(editor)
      openImageModal()
    },
    [editor, openImageModal]
  )

  // TODO: ListType should eventually be replaced by a type without the list item
  const onToggleList = useCallback(
    (type: ListType) => (event: React.MouseEvent) => {
      event.preventDefault()
      toggleList(editor, type)
    },
    [editor]
  )

  const onToggleNumberedList = useMemo(() => onToggleList(ListType.OL_LIST), [
    onToggleList,
  ])

  const onToggleBulletedList = useMemo(() => onToggleList(ListType.UL_LIST), [
    onToggleList,
  ])

  return (
    <>
      <ToolbarContainer>
        <Section>
          <FormatButton format={HeadingType.H1} />
          <FormatButton format={HeadingType.H2} />
        </Section>

        <Section>
          <FormatButton format={BLOCKQUOTE} />
          <FormatButton format={CODE_BLOCK} />
          <FormatButton format={IMAGE} onMouseDown={onInsertImage} />
        </Section>

        <Section>
          <FormatButton
            format={ListType.OL_LIST}
            onMouseDown={onToggleNumberedList}
          />
          <FormatButton
            format={ListType.UL_LIST}
            onMouseDown={onToggleBulletedList}
          />
        </Section>

        <Section>
          <FormatButton
            text="hr"
            format={HORIZONTAL_RULE}
            onMouseDown={onInsertHorizontalRule}
          />
        </Section>

        {/* <Section>
          <FormatButton format={ELEMENTS.EMBED} text="Embed" />
        </Section> */}
      </ToolbarContainer>
      <ImageModal>
        <ImageModalContent close={closeImageModal} selection={selection} />
      </ImageModal>
    </>
  )
}
