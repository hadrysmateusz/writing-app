import React from "react"
import { useSlate } from "slate-react"

import { Button } from "../Button"
import { serializeHTML, parseToMarkdown } from "../../slate-helpers"
import { useModal } from "../Modal"
import styled from "styled-components/macro"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;
`

export const ExportModalContent: React.FC<{
  close: () => void
}> = ({ close }) => {
  const editor = useSlate()

  const handleExportHTML = () => {
    const exported = serializeHTML(editor)
    alert(exported)
    close()
  }

  const handleExportMarkdown = () => {
    const exported = editor.children
      .map((node) => parseToMarkdown(node))
      .join("\n")
    alert(exported)
    close()
  }

  return (
    <ModalContainer>
      <Button onClick={handleExportMarkdown}>Export as Markdown</Button>
      <Button onClick={handleExportHTML}>Export as HTML</Button>
    </ModalContainer>
  )
}

export const ExportButton: React.FC = () => {
  const {
    open: openExportModal,
    close: closeExportModal,
    Modal: ExportModal,
  } = useModal(false)

  const handleExport = () => {
    openExportModal()
  }

  return (
    <>
      <Button onClick={handleExport}>Export</Button>
      <ExportModal>
        <ExportModalContent close={closeExportModal} />
      </ExportModal>
    </>
  )
}
