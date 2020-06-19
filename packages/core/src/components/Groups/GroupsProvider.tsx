import React, { useCallback } from "react"

import { v4 as uuidv4 } from "uuid"

import { useDatabase, GroupDoc } from "../Database"
import { GroupsAPIContext } from "./GroupsContext"
import { CreateGroupFn, RenameGroupFn, RemoveGroupFn } from "./types"

export const GroupsAPIProvider: React.FC = ({ children }) => {
  const db = useDatabase()

  /**
   * Handles creating a new document by asking for a name, creating a document
   * in DataStore and switching the editor to the new document
   */
  const createGroup: CreateGroupFn = useCallback(
    async (parentGroup: string | null) => {
      const newGroup = await db.groups.insert({
        id: uuidv4(),
        name: "",
        parentGroup: parentGroup,
      })

      return newGroup
    },
    [db.groups]
  )

  /**
   * Rename group by id
   */
  const renameGroup: RenameGroupFn = useCallback(
    async (groupId: string, name: string) => {
      const original = await db.groups.findOne().where("id").eq(groupId).exec()

      if (original === null) {
        throw new Error(`no group found matching this id (${groupId})`)
      }

      const updated = await original.update({
        $set: {
          name: name.trim(),
        },
      })

      // TODO: error handling

      return updated as GroupDoc
    },
    [db.groups]
  )

  /**
   * Handles deleting groups and its children
   */
  const removeGroup: RemoveGroupFn = useCallback(
    async (groupId: string) => {
      // TODO: consider creating findById static methods on all collections that will abstract this query
      const original = await db.groups.findOne().where("id").eq(groupId).exec()

      if (original === null) {
        throw new Error(`no group found matching this id (${groupId})`)
      }

      // TODO: figure out what the returned boolean means
      return original.remove()
    },
    [db.groups]
  )

  return (
    <GroupsAPIContext.Provider
      value={{
        removeGroup,
        renameGroup,
        createGroup,
      }}
    >
      {children}
    </GroupsAPIContext.Provider>
  )
}
