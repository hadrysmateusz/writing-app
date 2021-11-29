import React, { useCallback, useEffect, useState } from "react"

import { formatOptional } from "../../../../utils"
import { useToggleable } from "../../../../hooks"

import { MainHeader } from "../../../DocumentsList"
import SidebarDocumentItemComponent from "../../../DocumentsList/SidebarDocumentItemComponent"
import SectionHeaderComponent from "../../../DocumentsList/SectionHeaderComponent"
import { useLocalSettings } from "../../../LocalSettings"
import { useDatabase } from "../../../Database"
import {
  ContextMenu,
  ContextMenuItem,
  useContextMenu,
} from "../../../NewContextMenu"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { useCurrentUser } from "../../.."
import { useTabsDispatch, useTabsState } from "../../../MainProvider"
import { TabsState } from "../../../MainProvider/tabsSlice"

import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

// TODO: rework/rename these types + eventually share them between web & desktop packages
type ValidatePathsObj = { path: string; name: string | null; exists: boolean }
type DirObject = {
  path: string
  name: string
  dirs: DirObject[]
  files: FileObject[]
}
type FileObject = { path: string; name: string }

export const LocalView: React.FC<{}> = () => {
  const db = useDatabase()
  const currentUser = useCurrentUser()
  const { updateLocalSetting } = useLocalSettings()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  // Don't use __setDirs directly after initial load, use updateDirs instead
  const [dirs, __setDirs] = useState<ValidatePathsObj[]>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)

      const localSettingsDoc = await db.local_settings
        .findOne(currentUser.username)
        .exec()

      if (localSettingsDoc === null) {
        throw new Error(
          `Couldn't find a local settings doc for user: ${currentUser.username}`
        )
      }

      const { localDocPaths } = localSettingsDoc

      const ipcResponse = await window.electron.invoke("VALIDATE_PATHS", {
        paths: localDocPaths,
      })

      console.log(ipcResponse)

      if (ipcResponse.status === "success") {
        const { dirs } = ipcResponse.data
        __setDirs(dirs)
      } else {
        // TODO: handle this
        console.warn("something went wrong")
      }

      setIsLoading(false)
    })()
  }, [currentUser.username, db.local_settings])

  const updateDirs = async (newDirs: ValidatePathsObj[]) => {
    __setDirs(newDirs)
    // update the persisted local doc paths
    const newLocalDocPaths = newDirs.map((dir) => dir.path)
    await updateLocalSetting("localDocPaths", newLocalDocPaths)
  }

  // TODO: better loading/empty state + handle errors
  return !isLoading && dirs ? (
    <LocalViewInner updateDirs={updateDirs} dirs={dirs} />
  ) : null
}

const LocalViewInner: React.FC<{
  dirs: ValidatePathsObj[]
  updateDirs: (dirs: ValidatePathsObj[]) => void
}> = ({ updateDirs, dirs }) => {
  const handleAddPath = async () => {
    // TODO: make sure there are no duplicate paths
    const res = await window.electron.invoke("ADD_PATH")
    // TODO: handle other statuses
    if (res.status === "success") {
      const foundIndex = dirs.findIndex((dir) => dir.path === res.data.dirPath)
      // only add if this path is not already in the list
      if (foundIndex === -1) {
        updateDirs([
          ...dirs,
          { name: res.data.baseName, path: res.data.dirPath, exists: true },
        ])
      }
    }
  }
  const handleRemovePath = async (path: string) => {
    const filteredDirs = dirs.filter((dir) => dir.path !== path)
    updateDirs(filteredDirs)
  }

  // TODO: if dir has exists === false, show a warning and a button to manually find the dir

  return (
    <PrimarySidebarViewContainer>
      <MainHeader title={"Local"} />
      <InnerContainer>
        {dirs.map((dir) => (
          <DirItem
            key={dir.path}
            path={dir.path}
            name={formatOptional(dir.name, "Unknown")}
            removeDir={handleRemovePath}
          />
        ))}
      </InnerContainer>

      <PrimarySidebarBottomButton icon="plus" handleClick={handleAddPath}>
        Add Path
      </PrimarySidebarBottomButton>
    </PrimarySidebarViewContainer>
  )
}

const LocalDocumentSectionHeader: React.FC<{
  path: string
  isOpen: boolean
  onToggle: () => void
  removeDir: (path: string) => void
}> = ({ path, children, removeDir, isOpen, onToggle }) => {
  const { openMenu, isMenuOpen, getContextMenuProps } = useContextMenu()

  const handleRemoveDir = useCallback(
    (_e) => {
      removeDir(path)
    },
    [path, removeDir]
  )

  return (
    <>
      <SectionHeaderComponent
        titleTooltip={path}
        isOpen={isOpen}
        onToggle={onToggle}
        onContextMenu={openMenu}
      >
        {children}
      </SectionHeaderComponent>

      {isMenuOpen ? (
        <ContextMenu {...getContextMenuProps()}>
          <ContextMenuItem onClick={handleRemoveDir}>
            Remove Directory
          </ContextMenuItem>
        </ContextMenu>
      ) : null}
    </>
  )
}

const DirItem: React.FC<{
  path: string
  name: string
  removeDir: (path: string) => void
}> = ({ path, name, removeDir }) => {
  const [files, setFiles] = useState<FileObject[]>([])
  const [dirs, setDirs] = useState<DirObject[]>([])

  useEffect(() => {
    window.electron.invoke("GET_FILES_AT_PATH", { path }).then((res) => {
      console.log(res)
      if (res.status === "success") {
        const { dirObj } = res.data
        setFiles(dirObj.files)
        setDirs(dirObj.dirs)
      } else {
        console.log("NOT SUCCESS :C")
      }
    })
  }, [path])

  return (
    <NestedDirItem
      path={path}
      name={name}
      files={files}
      dirs={dirs}
      removeDir={removeDir}
    />
  )
}

/**
 * Checks tabs state for a tab with a local document with path matching the param
 * @returns tabId of the tab containing the document or null if such tab wasn't found
 */
function findTabWithPath(tabsState: TabsState, path: string): string | null {
  let foundTabId: string | null = null
  Object.entries(tabsState.tabs).some(([tabId, tab]) => {
    if (tab.tabType === "localDocument" && tab.path === path) {
      foundTabId = tabId
      return true
    }
    return false
  })
  return foundTabId
}

const NestedDirItem: React.FC<
  DirObject & { removeDir: (path: string) => void }
> = ({ path, name, dirs, files, removeDir }) => {
  const { isOpen, toggle } = useToggleable(false)

  return files.length > 0 ? (
    <>
      <LocalDocumentSectionHeader
        path={path}
        removeDir={removeDir}
        isOpen={isOpen}
        onToggle={toggle}
      >
        {name}
      </LocalDocumentSectionHeader>

      {isOpen ? (
        <>
          {files.map((file) => (
            <LocalDocumentSidebarItem path={file.path} name={file.name} />
          ))}
          {dirs.map((dir) => (
            <NestedDirItem key={dir.path} {...dir} removeDir={removeDir} />
          ))}
        </>
      ) : null}
    </>
  ) : null
}

const LocalDocumentSidebarItem: React.FC<{ path: string; name: string }> = ({
  path,
  name,
}) => {
  const tabsDispatch = useTabsDispatch()
  const tabsState = useTabsState()

  const handleClick = useCallback(() => {
    const tabId = findTabWithPath(tabsState, path)
    // tab with this path already exists, switch to it
    if (tabId !== null) {
      tabsDispatch({ type: "switch-tab", tabId })
    } else {
      // check for a tab with keep === false
      const tempTab = Object.values(tabsState.tabs).find(
        (tab) => tab.keep === false
      )
      // if there is a tab with keep === false, we reuse that tab
      if (!!tempTab) {
        tabsDispatch({
          type: "replace-tab",
          tab: {
            tabId: tempTab.tabId,
            tabType: "localDocument",
            path: path,
            keep: false,
          },
          switch: true,
        })
      }
      // open document in new tab
      else {
        tabsDispatch({
          type: "create-tab",
          tabType: "localDocument",
          path: path,
          switch: true,
        })
      }
    }
  }, [path, tabsDispatch, tabsState])

  return (
    <SidebarDocumentItemComponent
      key={path}
      title={name}
      // TODO: replace these timestamps with real data
      modifiedAt={Date.now()}
      createdAt={Date.now()}
      // TODO: add an actual isCurrent check
      isCurrent={false}
      onClick={handleClick}
    />
  )
}
