import { GroupDoc, GroupDocType } from "../../Database"
import { Updater } from "./Misc"

export type GroupsAPI = {
  moveGroup: MoveGroupFn
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

export type FindGroupByIdFn = (id: string) => Promise<GroupDoc>

// TODO: figure out proper return value
export type MoveGroupFn = (
  subjectId: string,
  index: number,
  targetId: string
) => Promise<void>

export type RemoveGroupFn = (groupId: string) => Promise<boolean>

export type RenameGroupFn = (groupId: string, name: string) => Promise<GroupDoc>

export type UpdateGroupFn = (
  id: string,
  updater: Updater<GroupDoc, GroupDocType>
) => Promise<GroupDoc>
