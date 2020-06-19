import { GroupDoc } from "../Database"

export type GroupsAPI = {
  createGroup: CreateGroupFn
  renameGroup: RenameGroupFn
  removeGroup: RemoveGroupFn
}

export type CreateGroupFn = (parentGroup: string | null) => Promise<GroupDoc>

export type RemoveGroupFn = (groupId: string) => Promise<boolean>

export type RenameGroupFn = (groupId: string, name: string) => Promise<GroupDoc>
