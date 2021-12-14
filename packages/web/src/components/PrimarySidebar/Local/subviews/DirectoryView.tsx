import React, { useEffect, useMemo, useState } from "react"

import {
  GoUpMainHeaderButton,
  MainHeader,
  SortingMainHeaderButton,
} from "../../../DocumentsList"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import {
  parseSidebarPath,
  SIDEBAR_VAR,
  usePrimarySidebar,
} from "../../../ViewState"
import { useLocalFS } from "../../../LocalFSProvider"

import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

import { DirObjectRecursive, ValidatePathsObj } from "../types"
import { LocalDocumentsSubGroupInner } from "../DirItem"

const findClosestMatch = (dirs: DirObjectRecursive[], wantedPath: string) => {
  const closestMatch = dirs.find((dir) => {
    return wantedPath.includes(dir.path)
  })
  return closestMatch
}

const findExactMatch = (dirs: DirObjectRecursive[], wantedPath: string) => {
  const exactMatch = dirs.find((dir) => {
    return dir.path === wantedPath
  })
  return exactMatch
}

const findDirInTrees = (
  dirs: DirObjectRecursive[],
  wantedPath: string
): DirObjectRecursive | undefined => {
  const exactMatch = findExactMatch(dirs, wantedPath)
  if (exactMatch) {
    return exactMatch
  } else {
    const closestMatch = findClosestMatch(dirs, wantedPath)
    if (!closestMatch) {
      return undefined
    } else {
      return findDirInTrees(closestMatch.dirs, wantedPath)
    }
  }
}

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
  return !isLoading && dir ? (
    <DirectoryViewInner dir={dir} directoryPath={directoryPath} />
  ) : null
}

const DirectoryViewInner: React.FC<{
  dir: ValidatePathsObj
  directoryPath: string
}> = ({ dir, directoryPath }) => {
  const { createDocument: createFile, dirTrees } = useLocalFS()
  const { switchSubview } = usePrimarySidebar()

  // TODO: when adding dir path to local library paths list check if it's not a descendant of a path already on the list (this would cause a shitton of problems because the dirs and files inside would no longer be unique in the tree which will probably break watchers and other things)

  const dirTree = useMemo(() => {
    return findDirInTrees(dirTrees, directoryPath)
  }, [dirTrees, directoryPath])

  // console.log("FOUND DIR TREE", dirTree)

  // If the dir wasn't found, switch to more general sidebar view
  useEffect(() => {
    if (!dirTree) {
      switchSubview("local", "all")
    }
  }, [dirTree, switchSubview])

  // TODO: if dir has exists === false, show a warning and a button to manually find the dir
  // TODO: turn bottom button into a create local document action (and expose it in context menu)
  // TODO: move the add path action to maybe the main header (and probably context menu)

  return (
    <PrimarySidebarViewContainer>
      <MainHeader
        title={dir.name ?? "Unknown Directory"}
        buttons={[
          // TODO: add a way to go up one directory
          <GoUpMainHeaderButton
            goUpPath={SIDEBAR_VAR.primary.local.all}
            key={SIDEBAR_VAR.primary.local.all}
          />,
          // TODO: support sorting for local directories
          // <SortingMainHeaderButton key="sorting"/>,
        ]}
      />
      <InnerContainer>
        {dirTree ? (
          <LocalDocumentsSubGroupInner
            files={dirTree.files}
            dirs={dirTree.dirs}
          />
        ) : null}
      </InnerContainer>

      <PrimarySidebarBottomButton
        icon="plus"
        handleClick={() => createFile(dir.path)}
      >
        Create Document
      </PrimarySidebarBottomButton>
    </PrimarySidebarViewContainer>
  )
}
