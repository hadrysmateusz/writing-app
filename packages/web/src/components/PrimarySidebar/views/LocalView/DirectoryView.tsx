import React, { useEffect, useMemo, useState } from "react"

import { MainHeader } from "../../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  parseSidebarPath,
  SIDEBAR_VAR,
  usePrimarySidebar,
} from "../../../ViewState"

import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

import { ValidatePathsObj } from "./types"
import { DirItemInnerTopLevel } from "./DirItem"

export const DirectoryView: React.FC = () => {
  const { currentSubviews } = usePrimarySidebar()

  // calculate this in ViewStateProvider along with other path properties
  const directoryPath = useMemo(
    () => parseSidebarPath(currentSubviews.local)?.id,
    [currentSubviews.local]
  )

  console.log("directoryPath", directoryPath)

  return directoryPath ? (
    <DirectoryViewWithFoundDirPath directoryPath={directoryPath} />
  ) : null
}

const DirectoryViewWithFoundDirPath: React.FC<{
  directoryPath: string
}> = ({ directoryPath }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // Don't use __setDirs directly after initial load, use updateDirs instead
  const [dir, __setDir] = useState<ValidatePathsObj>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)

      const localDocPaths = [directoryPath]

      const ipcResponse = await window.electron.invoke("VALIDATE_PATHS", {
        paths: localDocPaths,
      })

      console.log(ipcResponse)

      if (ipcResponse.status === "success") {
        const { dirs } = ipcResponse.data
        __setDir(dirs[0])
      } else {
        // TODO: handle this
        console.warn("something went wrong")
      }

      setIsLoading(false)
    })()
  }, [directoryPath])

  // TODO: better loading/empty state + handle errors
  return !isLoading && dir ? <DirectoryViewInner dir={dir} /> : null
}

const DirectoryViewInner: React.FC<{
  dir: ValidatePathsObj
}> = ({ dir }) => {
  const handleCreateFile = async () => {
    const ipcResponse = await window.electron.invoke("CREATE_FILE", {})
  }

  // TODO: if dir has exists === false, show a warning and a button to manually find the dir
  // TODO: add local document context menu
  // TODO: turn bottom button into a create local document action (and expose it in context menu)
  // TODO: move the add path action to maybe the main header (and probably context menu)
  // TODO: refactor and generalize group tree items to support library dirs (and display them instead of collections when local documents are the selected view (also hide tags then (maybe change the entire navigator sidebar to support the local view then (e.g. add recent docs section instead of favorites))))

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={dir.name ?? "Unknown Directory"}
        goUpPath={SIDEBAR_VAR.primary.local.all} // TODO: add a way to go up one directory
      />
      <InnerContainer>
        <DirItemInnerTopLevel
          path={dir.path}
          removeDir={() => {
            // TODO: implement
            throw new Error("UNIMPLEMENTED")
          }}
        />
      </InnerContainer>

      <PrimarySidebarBottomButton icon="plus" handleClick={handleCreateFile}>
        Create Document
      </PrimarySidebarBottomButton>
    </PrimarySidebarViewContainer>
  )
}
