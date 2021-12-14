import { useCallback, useMemo, memo } from "react"
import { v4 as uuidv4 } from "uuid"
import mudder from "mudder"

import { GROUP_TREE_ROOT } from "../../constants"
import { useRxSubscription } from "../../hooks"
import { createContext } from "../../utils"

import { usePrimarySidebar } from "../ViewState"
import { useDatabase, GroupDoc, MyDatabase } from "../Database"

import {
  CreateGroupFn,
  RenameGroupFn,
  RemoveGroupFn,
  FindGroupByIdFn,
  UpdateGroupFn,
  MoveGroupFn,
  CloudGroupsStateContextType,
  CloudGroupsAPIContextType,
} from "./types"

const m = mudder.base62

const createGroupsQuery = (db: MyDatabase) =>
  db.groups.find().sort({ position: "desc" })

// TODO: make methods using IDs to find documents/groups/etc accept the actual RxDB document object instead to skip the query

export const [CloudGroupsStateContext, useCloudGroupsState] =
  createContext<CloudGroupsStateContextType>()

export const [CloudGroupsAPIContext, useCloudGroupsAPI] =
  createContext<CloudGroupsAPIContextType>()

export const CloudGroupsProvider: React.FC = memo(({ children }) => {
  const db = useDatabase()
  const primarySidebar = usePrimarySidebar()

  const { data: groups, isLoading } = useRxSubscription(createGroupsQuery(db))

  // // TODO: remove the central groups list and replace with querying the local database where needed
  // const [groups, setGroups] = useState<GroupDoc[]>([])

  // // Flag to manage whether this is the first time the app is loaded
  // const [isInitialLoad, setIsInitialLoad] = useState(() => true)

  /**
   * Finds a single group by id.
   *
   * Throws if the group can't be found.
   *
   * If can't find root group, it will attempt to create it.
   *
   * TODO: if soft-deleting groups is implemented, add an option and handling for removed groups like in findDocumentById
   *
   * TODO: if soft-deleting groups is implemented, consider creating a more generic function for both groups and documents
   */
  const findGroupById: FindGroupByIdFn = useCallback(
    async (id) => {
      let foundGroup = await db.groups.findOne().where("id").eq(id).exec()

      // // If was trying to find root group and failed, attempt to create it
      // if (foundGroup === null && id === ROOT_GROUP_ID) {
      //   foundGroup = await db.groups.createRootGroup()
      // }

      if (foundGroup === null) {
        throw new Error(`No group found matching this ID: ${id})`)
      }

      return foundGroup
    },
    [db.groups]
  )

  /**
   * Creates a new group under the provided parent group
   */
  const createGroup: CreateGroupFn = useCallback(
    async (parentGroupId, values, options = {}) => {
      const { switchTo = true } = options

      // TODO: create a slug from the name and append uuid or shortid to make debugging easier
      const newGroupId = uuidv4()

      const lastSibling = await db.groups
        .findOne()
        .where("parentGroup")
        .eq(parentGroupId)
        .sort({ position: "desc" })
        .exec()

      const prevPosition = lastSibling?.position
      let newPosition = (
        prevPosition ? m.mudder(prevPosition, "Z", 1) : m.mudder(1)
      )[0]

      let newGroup: GroupDoc | undefined

      try {
        newGroup = await db.groups.insert({
          id: newGroupId,
          name: "",
          parentGroup: parentGroupId,
          position: newPosition,
          ...values,
        })
      } catch (error) {
        console.error("Failed to create the new group object")
        throw error
      }

      if (switchTo) {
        // this timeout is needed because of the way the sidebar looks for groups - it fetches them once and does a search on the array
        // TODO: that behavior should probably be replaced by a normal query for the group id (maybe with an additional cache layer) and this should eliminate the need for this timeout
        // TODO: to make it even smoother I could make it so that the switch is instant (even before the collection is created) and the sidebar waits for it to be created, this would require the sidebar to not default to all documents view on an unfound group id and for groups to be soft deleted so that if it's deleted it can go to the all documents view and maybe show a notification saying that the group you were looking for was deleted (or simply an empty state saying the same requiring the user to take another action) and if it wasn't deleted but isn't found to simply wait for it to be created (there should be a timeout of course if something went wrong and maybe even internal state that could show an error/empty state if there was an issue with creating the group)
        setTimeout(() => {
          primarySidebar.switchSubview("cloud", "group", newGroupId)
        }, 100)
      }

      return newGroup
    },
    [db.groups, primarySidebar]
  )

  // TODO: special handling and protection for the root group
  const updateGroup: UpdateGroupFn = useCallback(
    async (id, updater) => {
      const original = await findGroupById(id)

      // TODO: this can be extracted for use with other collections
      // TODO: handle errors (especially the ones thrown in pre-middleware because they mean the operation wasn't applied) (maybe handle them in more specialized functions like rename and save)
      const updatedGroup: GroupDoc = await original.update(
        typeof updater === "function"
          ? { $set: updater(original) }
          : { $set: updater }
      )
      return updatedGroup
    },
    [findGroupById]
  )

  /**
   * Handles deleting groups and its children
   */
  const removeGroup: RemoveGroupFn = useCallback(
    async (groupId) => {
      // TODO: consider creating findById static methods on all collections that will abstract this query
      const original = await findGroupById(groupId)

      // TODO: figure out what the returned boolean means
      return original.remove()
    },
    [findGroupById]
  )

  /**
   * Rename group by id
   */
  const renameGroup: RenameGroupFn = useCallback(
    async (groupId, name) => {
      return updateGroup(groupId, { name: name.trim() })
    },
    [updateGroup]
  )

  const moveGroup: MoveGroupFn = useCallback(
    async (
      /**
       * Id of group that will be moved
       */
      subjectId,
      /**
       * New position of the group
       *
       * The provided 0-based index will be translated into a proper "position"
       */
      index,
      /**
       * Id of the group that will be the new parent of the group
       */
      targetId
    ) => {
      try {
        if (targetId === GROUP_TREE_ROOT) {
          targetId = null
        }

        // Make sure that the group is not being moved inside one of its descendants (or itself)
        let descendantId = targetId
        while (descendantId !== null) {
          if (descendantId === subjectId) {
            console.info("can't move group inside one of its descendants")
            return false
          }
          const group = await findGroupById(descendantId)
          descendantId = group.parentGroup
        }

        const siblings = await db.groups
          .find()
          .where("parentGroup")
          .eq(targetId)
          .sort({ position: "asc" })
          .exec()

        // const oldIndex = siblings.findIndex((g) => g.id === subjectId)

        // const isMovingBefore = oldIndex > index

        // const prevIndex = isMovingBefore ? index - 1 : index
        // const nextIndex = isMovingBefore ? index : index + 1

        const prevIndex = index
        const nextIndex = index + 1

        const prevPosition = siblings[prevIndex]?.position ?? "0"
        const nextPosition = siblings[nextIndex]?.position ?? "Z"

        const newPosition = m.mudder(prevPosition, nextPosition, 1)[0]

        try {
          await updateGroup(subjectId, {
            parentGroup: targetId,
            position: newPosition,
          })
          return true
        } catch (error) {
          console.error(error) // TODO: better error handling
          return false
        }

        // TODO: consider replacing this with a method on the GroupDoc objects (with this becoming a wrapper that first fetches the group object from db by ID)
        // const subjectGroup = await findGroupById(subjectId)
        // const targetGroup = await findGroupById(targetId)
        // console.log("subjectGroup", subjectGroup)
        // console.log("targetGroup", targetGroup)
        // if (subjectGroup.parentGroup === null) {
        //   throw new Error("can't move root group")
        // }
        // // The parent doesn't change - only the order
        // if (subjectGroup.parentGroup === targetId) {
        //   // create the new childGroups array
        //   const newTargetChildGroups = [...targetGroup.childGroups]
        //   // find the current index of the subject group
        //   const oldIndexOfSubject = newTargetChildGroups.findIndex(
        //     (id) => id === subjectId
        //   )
        //   if (oldIndexOfSubject === -1) {
        //     // TODO: find a way to handle this gracefully
        //     throw new Error("Subject not found in parent")
        //   }
        //   console.log("oldIndex", oldIndexOfSubject)
        //   // TODO: depending on how the dnd library handles the new index, this might need changes when moving to a location after the old location
        //   // remove the subjectId from the array
        //   newTargetChildGroups.splice(oldIndexOfSubject, 1)
        //   // insert the subjectId at new index
        //   newTargetChildGroups.splice(index, 0, subjectId)
        //   console.log(targetGroup.childGroups, newTargetChildGroups)
        //   try {
        //     await updateGroup(targetId, { childGroups: newTargetChildGroups })
        //     return true
        //   } catch (error) {
        //     console.error(error) // TODO: better error handling
        //     return false
        //   }
        // } else {
        //   const oldParentGroupId = subjectGroup.parentGroup
        //   const oldParentGroup = await findGroupById(oldParentGroupId)
        //   const oldParentChildGroups = [...oldParentGroup.childGroups]
        //   const oldIndexOfSubject = oldParentChildGroups.findIndex(
        //     (id) => id === subjectId
        //   )
        //   if (oldIndexOfSubject === -1) {
        //     throw new Error("Subject not found in parent") // TODO: find a way to handle this gracefully
        //   }
        //   const newParentChildGroups = oldParentChildGroups.splice(
        //     oldIndexOfSubject,
        //     1
        //   )
        //   const newTargetChildGroups = [...targetGroup.childGroups].splice(
        //     index,
        //     0,
        //     subjectId
        //   )
        //   // remove the subject id from old parent group's childGroups list
        //   const updateParentPromise = updateGroup(oldParentGroupId, {
        //     childGroups: newParentChildGroups,
        //   })
        //   // add the subject id to new parent group's childGroups list
        //   const updateTargetPromise = updateGroup(targetId, {
        //     childGroups: newTargetChildGroups,
        //   })
        //   // change the parentGroup id on the subject group
        //   const updateSubjectPromise = updateGroup(subjectId, {
        //     parentGroup: targetId,
        //   })
        //   try {
        //     await Promise.all([
        //       updateParentPromise,
        //       updateTargetPromise,
        //       updateSubjectPromise,
        //     ])
        //     return true
        //   } catch (error) {
        //     console.error(error) // TODO: better error handling
        //     return false
        //   }
        // }
      } catch (error) {
        console.error(error) // TODO: better error handling
        return false
      }
    },
    [db.groups, findGroupById, updateGroup]
  )

  // /**
  //  * Handles setting up the groups subscription
  //  */
  // useEffect(() => {
  //   let groupsSub: Subscription | undefined

  //   groupsSub = createGroupsQuery(db).$.subscribe((newGroups) => {
  //     setGroups(newGroups)
  //   })

  //   return () => {
  //     cancelSubscriptions(groupsSub)
  //   }
  // }, [db])

  // /**
  //  * Fetches the cloud groups for the first time
  //  */
  // useEffect(() => {
  //   if (isInitialLoad) {
  //     // TODO: this can fail if root group can't be found / created - handle this properly
  //     createGroupsQuery(db)
  //       .exec()
  //       .then((newGroups) => {
  //         setGroups(newGroups)
  //         setIsInitialLoad(false)
  //       })
  //   }
  // }, [db, isInitialLoad])

  const cloudGroupsStateContextValue = useMemo(
    () => ({
      groups: groups || [],
      isLoading,
    }),
    [groups, isLoading]
  )

  const cloudGroupsAPIContextValue = useMemo(
    () => ({
      moveGroup,
      removeGroup,
      renameGroup,
      createGroup,
      updateGroup,
      findGroupById,
    }),
    [
      createGroup,
      findGroupById,
      moveGroup,
      removeGroup,
      renameGroup,
      updateGroup,
    ]
  )

  return (
    <CloudGroupsStateContext.Provider value={cloudGroupsStateContextValue}>
      <CloudGroupsAPIContext.Provider value={cloudGroupsAPIContextValue}>
        {children}
      </CloudGroupsAPIContext.Provider>
    </CloudGroupsStateContext.Provider>
  )
})
