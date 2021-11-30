import { useState, useEffect } from "react"

import Icon from "../../Icon"

import { EditorTabContainer } from "../EditorTab.styles"
import { TabCloseButton } from "../EditorTabCommon"

export const LocalDocumentEditorTab: React.FC<{
  path: string
  isActive: boolean
  keep: boolean
  handleSwitchTab: (e: React.MouseEvent) => void
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ path, isActive, keep, handleSwitchTab, handleCloseTab }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState<string>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)

      // TODO: figure a more efficient solution that doesn't require reading, the file's contents from disk (again)
      // TODO: also get the file's parent directory and use it like group in cloud documents (maybe)
      const ipcResponse = await window.electron.invoke("OPEN_FILE", {
        filePath: path,
      })

      console.log(ipcResponse)

      if (ipcResponse.status === "success") {
        // TODO: handle possible data-shape errors
        setTitle(ipcResponse.data.file.fileName)
      } else {
        // TODO: handle this
        console.warn("something went wrong")
      }

      setIsLoading(false)
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
        {/* TODO: support renaming the file (although maybe just from context menu) */}
        {title ?? "Loading..."}
      </div>
      {/* {tabData.group ? <div className="tab-group">{tabData.group}</div> : null} */}
      <TabCloseButton handleCloseTab={handleCloseTab} />
      {/* TODO: add context menu with basic actionas like renaming */}
    </EditorTabContainer>
  )
}
