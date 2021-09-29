import React, { useCallback } from "react"
import styled from "styled-components/macro"

import { Button } from "../Button"
import { useDocumentsAPI } from "../MainProvider"
import { deserializeMarkdown } from "../../slate-helpers/deserialize"
import { useViewState, PrimarySidebarViews, CloudViews } from "../ViewState"
import { useMainState } from "../MainProvider"
import { CloseModalFn } from "../Modal/types"

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
  close: CloseModalFn<undefined>
}> = ({ close }) => {
  const { createDocument } = useDocumentsAPI()
  const { primarySidebar } = useViewState()
  const { openDocument } = useMainState()

  const handleSuccess = useCallback(
    async (result: any, format: "md") => {
      const deserializer = { md: deserializeMarkdown }[format]

      const files = result.data as { fileName: string; content: string }[]

      // TODO: add some validation, and make sure importing files can't be exploited

      const parsed = files.map((file) => {
        const { fileName, content } = file
        return {
          title: fileName,
          content: deserializer(content),
        }
      })

      const documentPromises = parsed.map(({ title, content }) => {
        // If I switch to using the first heading as title, then inferring the title might not be necessary (although if there is no first heading then I should probably use the file name)
        return createDocument(
          null,
          { title, content },
          { switchToDocument: false }
        )
      })

      const documents = await Promise.all(documentPromises)

      const num = documents.length

      if (num === 0) {
        console.error(
          "Importer returned an unexpected result: no files with status success"
        )
        return
      }

      const docId = documents[0].id
      openDocument(docId)

      // TODO: when selecting target collection for imports is implemented this should be replaced with the groupId
      primarySidebar.switchSubview(PrimarySidebarViews.cloud, CloudViews.INBOX)
    },
    [createDocument, primarySidebar, openDocument]
  )

  const importFile = useCallback(
    async (format: "md") => {
      const result = await window.electron.invoke("READ_FILE", {
        format: format,
      })

      if (result.status === "error") {
        // TODO: display the error better
        alert(result.error)
      }

      if (result.status === "success") {
        handleSuccess(result, format)
      }

      close(undefined)
    },
    [close, handleSuccess]
  )

  const handleImportMarkdown = useCallback(() => {
    importFile("md")
  }, [importFile])

  // TODO: add a selector for the target collection
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
