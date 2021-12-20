import { useCallback } from "react"

import { useDocumentsAPI } from "../../../CloudDocumentsProvider"

import { PrimarySidebarBottomButton } from "../PrimarySidebarBottomButton"

export const NewButton: React.FC<{ groupId: string | null }> = ({
  groupId = null,
}) => {
  const { createDocument } = useDocumentsAPI()

  const handleNew = useCallback(() => {
    createDocument({ parentGroup: groupId })
  }, [createDocument, groupId])

  return (
    <PrimarySidebarBottomButton icon="plus" handleClick={handleNew}>
      New Document
    </PrimarySidebarBottomButton>
  )
}
