import { useEffect, useState } from "react"

import { formatOptional } from "../../../../utils"

import { MainHeader } from "../../../DocumentsList"
import { useLocalSettings } from "../../../LocalSettings"
import { useDatabase } from "../../../Database"
import {
  PrimarySidebarViewContainer,
  InnerContainer,
} from "../../../SidebarCommon"
import { useCurrentUser } from "../../../Auth"

import { PrimarySidebarBottomButton } from "../../PrimarySidebarBottomButton"

import { ValidatePathsObj } from "./types"
import { DirItem } from "./DirItem"

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
