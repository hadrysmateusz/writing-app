export type OpenFileObject = { name: string; content: string }

export type FileObject = { name: string; path: string }

export type DirObjectRecursive = {
  path: string
  name: string
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
