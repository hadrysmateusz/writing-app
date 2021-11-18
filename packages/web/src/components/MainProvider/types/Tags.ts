import { TagDoc, TagDocType } from "../../Database"

export type TagsAPI = {
  createTag: CreateTagFn
  renameTag: RenameTagFn
  actuallyPermanentlyDeleteTag: ActuallyPermanentlyDeleteTagFn
}

export type CreateTagFn = (values: Pick<TagDocType, "name">) => Promise<TagDoc>
export type RenameTagFn = (id: string, name: string) => Promise<TagDoc>
export type ActuallyPermanentlyDeleteTagFn = (id: string) => void
