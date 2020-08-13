import React, { useCallback } from "react"

import { Button } from "../Button"
import styled from "styled-components/macro"
import { useDocumentsAPI } from "../MainProvider"
import { deserializeMarkdown } from "../../slate-helpers/deserialize"
import { Node } from "slate"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 14px 20px;
  border-radius: 4px;
  color: white;

  h2 {
    color: #e8e8e8;
    font-size: 20px;
    line-height: 24px;
    margin-top: 0;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  > * + * {
    margin-left: 12px;
  }
`

export const ImportModalContent: React.FC<{
  close: () => void
}> = ({ close }) => {
  const { createDocument } = useDocumentsAPI()

  const importFile = useCallback(
    async (format: "html" | "md" /* TODO: replace with FileFormats enum */) => {
      const deserializer = { md: deserializeMarkdown }[format]

      const result = await window.ipcRenderer.invoke("read-file", {
        format: format,
      })

      if (result.status === "error") {
        // TODO: display the error better
        alert(result.error)
      }

      if (result.status === "success") {
        const files = result.data as string[]

        const parsed = files.map<Node[]>((rawContent) =>
          deserializer(rawContent)
        )

        parsed.forEach((content) => {
          createDocument(null, { content }, { switchTo: false })
        })
      }

      close()
    },
    [close, createDocument]
  )

  const handleImportMarkdown = useCallback(() => {
    importFile("md")
  }, [importFile])

  return (
    <ModalContainer>
      <h2>Import</h2>
      <ButtonsContainer>
        <Button onClick={handleImportMarkdown} autoFocus>
          Markdown
        </Button>
      </ButtonsContainer>
    </ModalContainer>
  )
}
