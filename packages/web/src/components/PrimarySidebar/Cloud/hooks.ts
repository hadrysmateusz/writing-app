import { useCallback, useMemo } from "react"
import { RxQuery } from "rxdb"
import cloneDeep from "lodash/cloneDeep"

import {
  createGenericDocumentFromCloudDocument,
  createGenericGroupTreeFromCloudGroups,
} from "../../../helpers"
import { GenericDocument } from "../../../types"
import { useRxSubscriptionWithTransformer } from "../../../hooks"

import { DocumentDoc, DocumentDocType } from "../../Database"
import { useCloudGroupsState } from "../../CloudGroupsProvider"

// TODO: move these to a better place

export const useGenericGroupTreeFromCloudGroups = (
  rootGroupId: string | null
) => {
  const { groups } = useCloudGroupsState()
  const genericGroupTree = useMemo(
    () => createGenericGroupTreeFromCloudGroups(groups, rootGroupId),
    [groups, rootGroupId]
  )
  return genericGroupTree
}

export const useGenericDocumentsFromCloudDocumentsQuery = (
  query: RxQuery<DocumentDocType, DocumentDoc[]>
): [GenericDocument[], boolean] => {
  const transformer = useCallback(
    (documents: DocumentDoc[]) =>
      documents.map((doc) => createGenericDocumentFromCloudDocument(doc)),
    []
  )

  const { data: flatDocuments, isLoading } = useRxSubscriptionWithTransformer(
    query,
    transformer,
    []
  )

  return useMemo(
    () => [cloneDeep(flatDocuments), isLoading] as [GenericDocument[], boolean],
    [flatDocuments, isLoading]
  )
}
