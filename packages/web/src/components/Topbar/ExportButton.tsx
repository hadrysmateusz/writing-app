import React, { useCallback } from "react"
// import { useSlateStatic } from "slate-react"

import { Button } from "../Button"
// import { serializeHTML, serializeMarkdown } from "../../slate-helpers"
import { useModal } from "../Modal"
import styled from "styled-components/macro"
// import { useMainState } from "../MainProvider"
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

export const ExportModalContent: React.FC<{
  close: CloseModalFn<void>
}> = ({ close }) => {
  // const editor = useSlateStatic()
  // const { currentDocument } = useMainState()

  // TODO: add a way to export in a browser (probably generate on a server if anything more complex is required and download)
  // TODO: consider offloading the serializing to the main process to allow it to run in parallel to selecting the file path
  // TODO: fix the serializers and then move to the new ipc system
  const exportFile = useCallback(
    async (format: "html" | "md" /* TODO: replace with FileFormats enum */) => {
      // const name = currentDocument?.title
      // const serializer = { md: serializeMarkdown, html: serializeHTML }[format]
      // const result = await window.ipcRenderer.invoke("save-file", {
      //   content: serializer(editor),
      //   format: format,
      //   name,
      // })
      // if (result.error) {
      //   alert(result.error)
      // }
      // close()
    },
    // [close, currentDocument, editor]
    []
  )

  const handleExportHTML = useCallback(() => {
    exportFile("html")
  }, [exportFile])

  const handleExportMarkdown = useCallback(() => {
    exportFile("md")
  }, [exportFile])

  return (
    <ModalContainer>
      <h2>Export as</h2>
      <ButtonsContainer>
        <Button onClick={handleExportMarkdown} autoFocus>
          Markdown
        </Button>
        <Button onClick={handleExportHTML}>HTML</Button>
      </ButtonsContainer>
    </ModalContainer>
  )
}

export const ExportButton: React.FC = () => {
  const { open: openExportModal, Modal: ExportModal } = useModal(false, {})

  const handleExport = () => {
    openExportModal({})
  }

  return (
    <>
      <Button onClick={handleExport}>Export</Button>
      <ExportModal>{(props) => <ExportModalContent {...props} />}</ExportModal>
    </>
  )
}
