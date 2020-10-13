import React from "react"
import styled from "styled-components/macro"

import { useMainState } from "../MainProvider"
import { useEditableText, EditableText } from "../RenamingInput"
import { useDocumentsAPI } from "../MainProvider"

import { formatOptional } from "../../utils"

export const DocumentTitle: React.FC<{}> = () => {
  const { renameDocument } = useDocumentsAPI()
  const { currentDocument } = useMainState()

  const { getProps: getEditableProps } = useEditableText(
    formatOptional(currentDocument?.title, ""),
    (value: string) => {
      if (currentDocument === null) return
      renameDocument(currentDocument.id, value)
    }
  )

  const title = formatOptional(currentDocument?.title, "Untitled")

  return (
    <TitleContainer>
      <EditableText {...getEditableProps()} disabled={currentDocument === null}>
        {title}
      </EditableText>
    </TitleContainer>
  )
}

const TitleContainer = styled.div`
  --width: 226px;

  letter-spacing: 0.01em;
  max-width: var(--width);

  .EditableText_editable {
    padding: 2px 2px 1px;
    width: var(--width);
  }
`
