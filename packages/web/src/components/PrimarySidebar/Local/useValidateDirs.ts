import { useEffect, useState } from "react"

import { ValidatePathsObj } from "shared"

import { useLocalSettings } from "../../LocalSettings"
import { useDatabase } from "../../Database"
import { useCurrentUser } from "../../Auth"

// TODO: figure out a name for this step
export const useValidateDirs = () => {
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

  return { isLoading, dirs, updateDirs }
}
