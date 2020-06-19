import { GroupsAPI } from "./types"
import { createContext } from "react"
import { useRequiredContext } from "../../hooks/useRequiredContext"

export const GroupsAPIContext = createContext<GroupsAPI | null>(null)

export const useGroupsAPI = () => {
  return useRequiredContext<GroupsAPI>(
    GroupsAPIContext,
    "GroupsAPI context is null"
  )
}
