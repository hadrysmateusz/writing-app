// TODO: rework/rename these types + eventually share them between web & desktop packages
export type ValidatePathsObj = {
  path: string
  name: string | null
  exists: boolean
}
export type DirObject = {
  path: string
  name: string
  dirs: DirObject[]
  files: FileObject[]
}
export type FileObject = { path: string; name: string }
