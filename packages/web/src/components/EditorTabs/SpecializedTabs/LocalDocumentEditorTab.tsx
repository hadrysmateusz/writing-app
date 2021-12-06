import { useState, useEffect } from "react"

import Icon from "../../Icon"

import { EditorTabContainer } from "../EditorTab.styles"
import { TabCloseButton } from "../EditorTabCommon"

type DocumentState = {
  isLoading: boolean
  isMissing: boolean
  document: { title: string } | undefined
}

const INITIAL_DOCUMENT_STATE: DocumentState = {
  isLoading: true,
  isMissing: false,
  document: undefined,
}
export const LocalDocumentEditorTab: React.FC<{
  path: string
  isActive: boolean
  keep: boolean
  handleSwitchTab: (e: React.MouseEvent) => void
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ path, isActive, keep, handleSwitchTab, handleCloseTab }) => {
  const [documentState, setDocumentState] = useState<DocumentState>(
    INITIAL_DOCUMENT_STATE
  )

  useEffect(() => {
    ;(async () => {
      setDocumentState({
        isLoading: true,
        isMissing: false,
        document: undefined,
      })

      // TODO: figure a more efficient solution that doesn't require reading, the file's contents from disk (again)
      // TODO: also get the file's parent directory and use it like group in cloud documents (maybe)
      const ipcResponse = await window.electron.invoke("OPEN_FILE", {
        filePath: path,
      })

      console.log(ipcResponse)

      if (ipcResponse.status === "success") {
        // TODO: handle possible data-shape errors
        setDocumentState({
          isLoading: false,
          isMissing: false,
          document: { title: ipcResponse.data.file.name },
        })
      } else {
        console.warn("something went wrong")
        setDocumentState({
          isLoading: false,
          isMissing: true,
          document: undefined,
        })
      }
    })()
  }, [path])

  // TODO: show some form of loading state
  return (
    <EditorTabContainer
      isActive={isActive}
      keep={keep}
      onClick={handleSwitchTab}
    >
      <div className="tab-icon">
        <Icon icon="folderClosed" />
      </div>
      <div className="tab-title">
        {documentState.isLoading
          ? "Loading..."
          : documentState.isMissing
          ? "Deleted"
          : documentState.document?.title || "Error"}
        {/* TODO: support renaming the file (although maybe just from context menu) */}
      </div>
      {/* {tabData.group ? <div className="tab-group">{tabData.group}</div> : null} */}
      <TabCloseButton handleCloseTab={handleCloseTab} />
      {/* TODO: add context menu with basic actions like renaming */}
    </EditorTabContainer>
  )
}
