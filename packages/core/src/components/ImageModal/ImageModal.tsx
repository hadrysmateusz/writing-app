import React, { useState, useEffect, useRef } from "react"
import { useSlate } from "slate-react"
import styled from "styled-components/macro"

import { insertImage } from "../../slate-plugins"
import { Range, Transforms } from "slate"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;
`

export const ImageModalContent: React.FC<{
  close: () => void
  selection: Range | null
}> = ({
  close,
  /* The way selection is handled here (through a prop) is extremely hacky and should be replaced with a more robust and universal solution for reapplying selection */
  selection,
}) => {
  const urlInputRef = useRef<HTMLInputElement>()
  const editor = useSlate()
  const [url, setUrl] = useState<string>("")

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (selection !== null) {
      Transforms.select(editor, selection)
    }
    if (url.trim() !== "") {
      // TODO: url validation (probably inside the insertImage function)
      // TODO: handle a situation where it's not a valid url
      insertImage(editor, url)
    }
    close()
  }

  useEffect(() => {
    urlInputRef?.current?.focus()
  }, [])

  return (
    <ModalContainer>
      <form onSubmit={onSubmit}>
        <input type="text" value={url} onChange={onChange} ref={urlInputRef} />
        <button type="submit">Add Image</button>
      </form>
    </ModalContainer>
  )
}
