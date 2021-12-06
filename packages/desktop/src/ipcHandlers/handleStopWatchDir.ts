import { closeWatcherForDir } from "../helpers"

export const handleStopWatchDir = async (
  _event,
  payload: {
    dirPath: string
    timestamp: number
  }
) => {
  const { dirPath, timestamp } = payload
  await closeWatcherForDir(dirPath, timestamp)
}
