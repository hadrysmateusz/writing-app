import { GroupDoc, GroupDocType, Updater } from "../Database"

// ======== API Methods Types =========

export type CreateGroupFn = (
  parentGroupId: string | null,
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
  targetId: string | null
) => Promise<boolean>

export type RemoveGroupFn = (groupId: string) => Promise<boolean>

export type RenameGroupFn = (groupId: string, name: string) => Promise<GroupDoc>

export type UpdateGroupFn = (
  id: string,
  updater: Updater<GroupDoc, GroupDocType>
) => Promise<GroupDoc>

// ========= Context Types =========

export type CloudGroupsStateContextType = {
  groups: GroupDoc[]
  isLoading: boolean
}

export type CloudGroupsAPIContextType = {
  moveGroup: MoveGroupFn
  createGroup: CreateGroupFn
  renameGroup: RenameGroupFn
  removeGroup: RemoveGroupFn
  updateGroup: UpdateGroupFn
  findGroupById: FindGroupByIdFn
}
