import { RxDocument } from "rxdb"
import { GroupDoc, GroupDocType, GroupDocMethods } from "../../Database"
import { Updater } from "./Misc"

export type GroupsAPI = {
  createGroup: CreateGroupFn
  renameGroup: RenameGroupFn
  removeGroup: RemoveGroupFn
  updateGroup: UpdateGroupFn
  findGroupById: FindGroupByIdFn
}

export type CreateGroupFn = (
  parentGroup: string | null,
  values?: Partial<GroupDoc>,
  options?: {
    switchTo?: boolean
  }
) => Promise<GroupDoc>

export type FindGroupByIdFn = (
  id: string
) => Promise<RxDocument<GroupDocType, GroupDocMethods> | null>

export type RemoveGroupFn = (groupId: string) => Promise<boolean>

export type RenameGroupFn = (groupId: string, name: string) => Promise<GroupDoc>

export type UpdateGroupFn = (
  id: string,
  updater: Updater<GroupDoc, GroupDocType>
) => Promise<GroupDoc>
