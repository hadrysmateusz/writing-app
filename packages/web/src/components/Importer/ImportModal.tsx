import React, { useCallback, useState } from "react"
import styled from "styled-components/macro"

import { Button } from "../Button"
import { useDocumentsAPI } from "../MainProvider"
import { deserializeMarkdown } from "../../slate-helpers/deserialize"
import { useViewState, PrimarySidebarViews, CloudViews } from "../ViewState"
import { useMainState } from "../MainProvider"
import { CloseModalFn } from "../Modal/types"
import {
  ContextMenuItem,
  ContextMenuSeparator,
  menuContainerCommon,
} from "../ContextMenu"
import { formatOptional } from "../../utils"
import { useToggleable } from "../../hooks"
import Icon from "../Icon"

export const ImportModalContent: React.FC<{
  close: CloseModalFn<undefined>
}> = ({ close }) => {
  const { createDocument } = useDocumentsAPI()
  const { primarySidebar } = useViewState()
  const { openDocument, groups } = useMainState()

  const [targetGroup, setTargetGroup] = useState(() => {
    const subview = primarySidebar.currentSubviews.cloud
    if (groups.map((group) => group.id).includes(subview)) {
      return subview
    } else {
      return null
    }
  })

  const handleSuccess = useCallback(
    async (result: any, format: "md") => {
      const deserializer = { md: deserializeMarkdown }[format]

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
        return createDocument(
          targetGroup,
          { title, content },
          { switchToDocument: false }
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
      primarySidebar.switchSubview(PrimarySidebarViews.cloud, CloudViews.INBOX)
    },
    [openDocument, primarySidebar, createDocument, targetGroup]
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

  // TODO: add a selector for the target collection
  return (
    <ModalContainer>
      <h2>Import</h2>
      {/* <p>Select Target Group</p> */}
      <ButtonsContainer>
        <DropdownContainer
          onClick={() => {
            toggle()
          }}
        >
          {formatOptional(
            groups.find((group) => group.id === targetGroup)?.name,
            "Inbox"
          )}
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
      </ButtonsContainer>
    </ModalContainer>
  )
}

export const DropdownContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;

  min-width: 0;
  padding: 6px 20px;
  margin: 0;
  border: 1px solid;
  border-radius: 3px;

  font-weight: 500;
  font-size: 12px;
  font-family: "Poppins";

  transition-property: background-color, color, border-color, background-image;
  transition-duration: 0.15s;
  transition-timing-function: ease;

  border-color: var(--dark-500);
  background: transparent;
  color: var(--light-400);
  position: relative;
  cursor: pointer;
  user-select: none;
`

export const DropdownContent = styled.div`
  /* Base styles */
  position: absolute;
  /* left: 100%; */
  top: 26px; /* based on the padding of the the container and border width*/
  max-height: 322px;
  overflow-y: auto;

  /* Visual styles */
  ${menuContainerCommon}
`

const ModalContainer = styled.div`
  background: var(--dark-400);
  border: 1px solid var(--dark-500);
  padding: 14px 20px;
  border-radius: 4px;
  color: white;

  h2 {
    color: var(--light-500);
    font-size: 20px;
    line-height: 24px;
    margin-top: 0;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  > * + * {
    margin-left: 12px;
  }
`
