import { RxDocument } from "rxdb"
import { GroupDocMethods, GroupDocType } from "../components/Database"

export const getGroupName = (
  groupId: string | null,
  groups: RxDocument<GroupDocType, GroupDocMethods>[]
) => {
  if (groups === null) {
    return null
  }

  const group = groups.find((group) => group.id === groupId)

  // TODO: better handle this
  if (group === undefined) {
    return null
  }

  return group.name
}
