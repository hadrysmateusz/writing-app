import { closeWatcherForDir } from "../helpers"

export const handleStopWatchDir = async (
  _event,
  payload: {
    watchedDirPath: string
    timestamp: number
  }
) => {
  const { watchedDirPath, timestamp } = payload
  await closeWatcherForDir(watchedDirPath, timestamp)
}
