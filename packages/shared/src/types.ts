export type OpenFileObject = { name: string; content: string }

export type LocalResourceCommon = {
  path: string
  name: string
  parentDirectory: string
}

export type FileObject = LocalResourceCommon & {
  createdAt: Date
  modifiedAt: Date
  content: string
}

export type DirObjectRecursive = LocalResourceCommon & {
  dirs: DirObjectRecursive[]
  files: FileObject[]
}

export type WatcherUnsubObj = {
  close: () => Promise<void>
  added: number
}

export type ValidatePathsObj =
  | {
      path: string
      exists: true
      name: string
    }
  | {
      path: string
      exists: false
      name: null
    }

export type SerializedEditorContent = string

export enum FileFormats {
  MARKDOWN = "md",
  HTML = "html",
}

export enum SupportedResourceTypes {
  file = "file",
  dir = "dir",
}
