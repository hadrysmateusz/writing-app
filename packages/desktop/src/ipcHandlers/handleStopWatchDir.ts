import { IpcResponseStatus, StopWatchDirPayload } from "shared"
import { closeWatcherForDir } from "../helpers"

export const handleStopWatchDir = async (
  _event,
  payload: StopWatchDirPayload
) => {
  try {
    const { watchedDirPath, timestamp } = payload
    console.log(`stop watching dir: ${watchedDirPath}`)
    await closeWatcherForDir(watchedDirPath, timestamp)
    return { status: IpcResponseStatus.SUCCESS, data: {}, error: null }
  } catch (err) {
    return {
      status: IpcResponseStatus.ERROR,
      data: null,
      error: err?.message || "Unknown error",
    }
  }
}
