import { StopWatchDirPayload } from "shared"
import { closeWatcherForDir } from "../helpers"
import { IpcResponseStatus } from "../types"

export const handleStopWatchDir = async (
  _event,
  payload: StopWatchDirPayload
) => {
  try {
    const { watchedDirPath, timestamp } = payload
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
