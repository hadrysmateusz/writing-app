import { useCallback } from "react"

import { mySerializeMd } from "../../slate-helpers/serialization"
// import { serializeHTML, serializeMarkdown } from "../../slate-helpers"

import { deserialize } from "../Editor/helpers"

import { Button } from "../Button"
import { Modal, CloseModalFn } from "../Modal"

export type ExportModalProps = {
  documentContent: string
  documentTitle: string
}
export type ExportModalReturnValue = void

export const ExportModalContent: React.FC<
  ExportModalProps & {
    close: CloseModalFn<ExportModalReturnValue>
  }
> = ({ close, documentContent, documentTitle }) => {
  console.log("export modal content")

  // TODO: add a way to export in a browser (probably generate on a server if anything more complex is required and download)
  // TODO: consider offloading the serializing to the main process to allow it to run in parallel to selecting the file path
  const exportFile = useCallback(
    async (format: "html" | "md" /* TODO: replace with FileFormats enum */) => {
      const name = documentTitle
      const serializer = {
        md: mySerializeMd,
        html: () => {
          // TODO: as a temporary solution use the remark serializer and convert to html with the remark-rehype bridge
          throw new Error("implement")
        },
      }[format]
      const result = await window.electron.invoke("EXPORT_FILE", {
        content: serializer(deserialize(documentContent)),
        format: format,
        name,
      })
      if (result.error) {
        console.warn(result.error)
      }
      close(undefined)
    },
    [close, documentContent, documentTitle]
  )

  const handleExportHTML = useCallback(() => {
    exportFile("html")
  }, [exportFile])

  const handleExportMarkdown = useCallback(() => {
    exportFile("md")
  }, [exportFile])

  return (
    <Modal.Container>
      <h2>Export as</h2>
      <Modal.ButtonsContainer>
        <Button onClick={handleExportMarkdown} autoFocus>
          Markdown
        </Button>
        <Button onClick={handleExportHTML}>HTML</Button>
      </Modal.ButtonsContainer>
    </Modal.Container>
  )
}
