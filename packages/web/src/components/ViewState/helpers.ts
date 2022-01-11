// TODO: the way this function works is probably why opening directories with underscores in the name don't work. Either rework the system or use a separator that is not supported in paths on any OS (that might be hard as it seems that MacOS supports all of unicode)

import { SIDEBAR_VAR, SidebarView, SidebarSubview } from "./types"

export const VIEW_PATH_SEGMENT_SEPARATOR = "_"
export const VIEW_PATH_ID_SEPARATOR = "?"

export function parseSidebarPath(path: string) {
  const indexOfQuestionMark = path.indexOf(VIEW_PATH_ID_SEPARATOR)

  const locationPath: string =
    indexOfQuestionMark === -1 ? path : path.slice(0, indexOfQuestionMark)

  const id: string | undefined =
    indexOfQuestionMark === -1
      ? undefined
      : path.slice(indexOfQuestionMark + 1, path.length)

  // console.log(`path: ${path} locationPath: ${locationPath}`)

  const pathParts = locationPath.split(VIEW_PATH_SEGMENT_SEPARATOR)
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

  return { sidebar, view, subview, id }

  // TODO: figure out how to make this check work with the last part being the id
  // if (SIDEBAR_VAR[sidebar][view][subview] === path) {
  //   return { sidebar, view, subview, id: pathParts[3] }
  // }
  // return null
}

export function createSidebarPath<View extends SidebarView<"primary">>(
  view: View,
  subview: SidebarSubview<"primary", View>,
  id?: string // optional id used for some paths like groups
) {
  let newPath = `primary_${view}_${subview}`

  if (id) {
    newPath += `${VIEW_PATH_ID_SEPARATOR}${id}`
  }

  return newPath
}
