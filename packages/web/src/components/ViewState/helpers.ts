// TODO: the way this function works is probably why opening directories with underscores in the name don't work. Either rework the system or use a separator that is not supported in paths on any OS (that might be hard as it seems that MacOS supports all of unicode)

import { SIDEBAR_VAR } from "./types"

// TODO: move this to a more logical place
export function parseSidebarPath(path: string) {
  const pathParts = path.split("_")
  // console.log(pathParts)

  const sidebar = Object.keys(SIDEBAR_VAR).find((s) => s === pathParts[0])
  if (!sidebar) return null
  // console.log(sidebar)

  const view = Object.keys(SIDEBAR_VAR[sidebar]).find((s) => s === pathParts[1])
  if (!view) return null
  // console.log(view)

  const subview = Object.keys(SIDEBAR_VAR[sidebar][view]).find(
    (s) => s === pathParts[2]
  )
  if (!subview) return null
  // console.log(subview)

  // console.log(SIDEBAR_VAR[sidebar][view][subview], path)

  return { sidebar, view, subview, id: pathParts[3] as string | undefined }

  // TODO: figure out how to make this check work with the last part being the id
  // if (SIDEBAR_VAR[sidebar][view][subview] === path) {
  //   return { sidebar, view, subview, id: pathParts[3] }
  // }
  // return null
}
