import React, { useCallback, useState } from "react"

import { myDeserializeMd } from "../../slate-helpers/deserialize"
import { formatOptional } from "../../utils"
import { useToggleable } from "../../hooks"

import { Button } from "../Button"
import { useDocumentsAPI } from "../MainProvider"
import { usePrimarySidebar } from "../ViewState"
import { useMainState } from "../MainProvider"
import { CloseModalFn } from "../Modal/types"
import { ContextMenuItem, ContextMenuSeparator } from "../ContextMenu"
import Icon from "../Icon"
import { serialize } from "../Editor"
import { ModalContainer, ModalButtonsContainer } from "../Modal"

import { DropdownContainer, DropdownContent } from "./ImportModal.styles"

export const ImportModalContent: React.FC<{
  close: CloseModalFn<undefined>
}> = ({ close }) => {
  const { createDocument } = useDocumentsAPI()
  const { switchSubview, currentSubviews } = usePrimarySidebar()

  const { openDocument, groups } = useMainState()

  const [targetGroup, setTargetGroup] = useState(() => {
    const subview = currentSubviews.cloud
    if (groups.map((group) => group.id).includes(subview)) {
      return subview
    } else {
      return null
    }
  })

  const handleSuccess = useCallback(
    async (result: any, format: "md") => {
      const deserializer = { md: myDeserializeMd }[format]

      const files = result.data as { fileName: string; content: string }[]

      // TODO: add some validation, and make sure importing files can't be exploited

      const parsed = files.map((file) => {
        const { fileName, content } = file
        return {
          title: fileName,
          content: deserializer(content),
        }
      })

      const documentPromises = parsed.map(({ title, content }) => {
        // If I switch to using the first heading as title, then inferring the title might not be necessary (although if there is no first heading then I should probably use the file name)
        const serializedContent = serialize(content)

        return createDocument(
          { parentGroup: targetGroup, title, content: serializedContent },
          { switchToDocument: false, switchToGroup: true }
        )
      })

      const documents = await Promise.all(documentPromises)

      const num = documents.length

      if (num === 0) {
        console.error(
          "Importer returned an unexpected result: no files with status success"
        )
        return
      }

      const docId = documents[0].id
      openDocument(docId)

      // TODO: when selecting target collection for imports is implemented this should be replaced with the groupId
      switchSubview("cloud", "inbox")
    },
    [createDocument, openDocument, switchSubview, targetGroup]
  )

  // TODO: figure out why importing takes such an insanely long time
  const importFile = useCallback(
    async (format: "md") => {
      const result = await window.electron.invoke("READ_FILE", {
        format: format,
      })

      if (result.status === "error") {
        // TODO: display the error better
        alert(result.error)
      }

      if (result.status === "success") {
        handleSuccess(result, format)
      }

      close(undefined)
    },
    [close, handleSuccess]
  )

  const handleImportMarkdown = useCallback(() => {
    importFile("md")
  }, [importFile])

  const { toggle, isOpen } = useToggleable(false)

  const groupName = formatOptional(
    groups.find((group) => group.id === targetGroup)?.name,
    "Inbox"
  )

  // TODO: add a selector for the target collection
  return (
    <ModalContainer>
      <h2>Import</h2>
      {/* <p>Select Target Group</p> */}
      <ModalButtonsContainer>
        <DropdownContainer
          onClick={() => {
            toggle()
          }}
        >
          {groupName}
          <Icon icon="caretDown" />
          {isOpen ? (
            <DropdownContent>
              <ContextMenuItem
                key="__INBOX__"
                onClick={() => setTargetGroup(null)}
              >
                Inbox
              </ContextMenuItem>
              <ContextMenuSeparator />
              {groups.map((group) => (
                <ContextMenuItem
                  key={group.id}
                  onClick={() => setTargetGroup(group.id)}
                >
                  {formatOptional(group.name, "Unnamed Collection")}
                </ContextMenuItem>
              ))}
            </DropdownContent>
          ) : null}
        </DropdownContainer>

        <Button onClick={handleImportMarkdown} autoFocus>
          Markdown
        </Button>
      </ModalButtonsContainer>
    </ModalContainer>
  )
}
