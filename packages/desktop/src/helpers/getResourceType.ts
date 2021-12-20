import fs from "fs-extra"

import { SupportedResourceTypes } from "shared"

export const getResourceType = (
  itemPathOrStats: fs.Stats | string
): SupportedResourceTypes | null => {
  let stats: fs.Stats
  if (typeof itemPathOrStats === "string") {
    stats = fs.statSync(itemPathOrStats)
  } else {
    stats = itemPathOrStats
  }

  if (stats.isFile()) {
    return SupportedResourceTypes.file
  } else if (stats.isDirectory()) {
    return SupportedResourceTypes.dir
  }

  return null
}
