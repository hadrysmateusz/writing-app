// TODO: rework/rename these types + eventually share them between web & desktop packages
export type ValidatePathsObj = {
  path: string
  name: string | null
  exists: boolean
}

export type DirObject = {
  path: string
  name: string
  dirs: ChildDirObject[]
  files: FileObject[]
}
export type ChildDirObject = Pick<DirObject, "path" | "name">
export type FileObject = { path: string; name: string }

export type DirObjectRecursive = {
  path: string
  name: string
  dirs: DirObjectRecursive[]
  files: FileObject[]
}
