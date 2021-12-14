import { memo } from "react"

// TODO: make methods using IDs to find documents/groups/etc accept the actual RxDB document object instead to skip the query
// TODO: create document history. When the current document is deleted move to the previous one if available, and maybe even provide some kind of navigation arrows.

export const OLD_MainProvider: React.FC = memo(({ children }) => {
  // const syncState = useSyncState()

  //#region sync state

  // // Handles removing documents from unsynced array when they get replicated
  // useEffect(() => {
  //   const sub = syncState.documents?.replicationState.change$.subscribe(
  //     (observer) => {
  //       if (observer.direction === "push") {
  //         const syncedDocs = observer.change.docs.map((doc) => doc._id)

  //         const tempUnsyncedDocs = unsyncedDocs.filter(
  //           (doc) => !syncedDocs.includes(doc)
  //         )

  //         updateLocalSetting("unsyncedDocs", tempUnsyncedDocs)
  //       }
  //     }
  //   )

  //   return () => sub && sub.unsubscribe()
  // }, [syncState.documents, unsyncedDocs, updateLocalSetting])

  // // Handles marking documents as unsynced when they are created, updated or deleted
  // useEffect(() => {
  //   // Subscribes to changes on the documents collection
  //   const sub = db.documents.$.subscribe(
  //     (event: RxChangeEvent<DocumentDoc>) => {
  //       const { documentData, isLocal, documentId } = event

  //       // TODO: I think this might mark documents as changed even when the change is coming FROM the server, make sure that doesn't happen
  //       // TODO: make sure that DELETE operations are handled properly, the code below is most likely not enough

  //       if (!documentData) {
  //         console.log("Skipping. No documentData in the event")
  //         return
  //       }

  //       if (isLocal) {
  //         console.log(`Skipping. Document ${documentId} is local.`)
  //         return
  //       }

  //       // Add document id to unsynced docs list, if it's not already in it
  //       if (!unsyncedDocs.includes(documentId)) {
  //         updateLocalSetting("unsyncedDocs", [...unsyncedDocs, documentId])
  //       }
  //     }
  //   )

  //   return () => sub.unsubscribe()
  // }, [db.documents.$, unsyncedDocs, updateLocalSetting])

  //#endregion

  return <>{children}</>
})
