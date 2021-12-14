import { TagDoc, TagDocType } from "../Database"

export type TagsAPI = {
  createTag: CreateTagFn
  renameTag: RenameTagFn
  actuallyPermanentlyDeleteTag: ActuallyPermanentlyDeleteTagFn
  permanentlyDeleteTag: PermanentlyDeleteTagFn
}

export type CreateTagFn = (
  values: Pick<TagDocType, "name">
) => Promise<TagDoc | null>
export type RenameTagFn = (id: string, name: string) => Promise<TagDoc>
export type ActuallyPermanentlyDeleteTagFn = (id: string) => Promise<void>
export type PermanentlyDeleteTagFn = (id: string) => Promise<void>
