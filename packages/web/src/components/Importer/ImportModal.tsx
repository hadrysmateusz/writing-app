import React, { useCallback, useState } from "react"

import { ImportFileResponseData } from "shared"

import { myDeserializeMd } from "../../slate-helpers/serialization"
import { formatOptional } from "../../utils"

import Icon from "../Icon"
import { Button } from "../Button"
import { usePrimarySidebar } from "../ViewState"
import { serialize } from "../Editor"
import { CloseModalFn, Modal } from "../Modal"
import { useDocumentsAPI } from "../CloudDocumentsProvider"
import { useTabsAPI } from "../TabsProvider"
import { useCloudGroupsState } from "../CloudGroupsProvider"
import {
  CollectionSelector,
  useCollectionSelector,
} from "../CollectionSelector"
import { Option } from "../Autocomplete"

import { DropdownContainer, DropdownContent } from "./ImportModal.styles"

export const ImportModalContent: React.FC<{
  close: CloseModalFn<undefined>
}> = ({ close }) => {
  const { switchSubview, currentSubviews } = usePrimarySidebar()
  const { createDocument } = useDocumentsAPI()
  const { openDocument } = useTabsAPI()
  const { groups } = useCloudGroupsState()

  const [targetGroup, setTargetGroup] = useState(() => {
    const subview = currentSubviews.cloud
    if (groups.map((group) => group.id).includes(subview)) {
      return subview
    } else {
      return null
    }
  })

  const handleSuccess = useCallback(
    async (data: ImportFileResponseData, format: "md") => {
      const deserializer = { md: myDeserializeMd }[format]

      const { files } = data

      // TODO: add some validation, and make sure importing files can't be exploited

      const parsed = files.map((file) => {
        const { name, content } = file
        return {
          title: name,
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
      const result = await window.electron.invoke("IMPORT_FILE", {
        format: format,
      })

      if (result.status === "error") {
        // TODO: display the error better
        alert(result.error)
      }

      if (result.status === "success") {
        handleSuccess(result.data, format)
      }

      close(undefined)
    },
    [close, handleSuccess]
  )

  const handleImportMarkdown = useCallback(() => {
    importFile("md")
  }, [importFile])

  const groupName = formatOptional(
    groups.find((group) => group.id === targetGroup)?.name,
    "Inbox"
  )

  const {
    getCollectionSelectorPropsAndRef,
    close: closeGroupSelector,
    toggle: toggleGroupSelector,
    isOpen,
  } = useCollectionSelector({ initialState: false })

  const handleSelectGroupSubmit = useCallback(
    async (option: Option) => {
      const selectedGroupId = option.value

      setTargetGroup(selectedGroupId)

      closeGroupSelector()
    },
    [closeGroupSelector]
  )

  // TODO: add a selector for the target collection
  return (
    <Modal.Container style={{ width: "500px" }}>
      <Modal.Message>Import</Modal.Message>
      <Modal.SecondaryMessage>
        Import a markdown file and transform it into a cloud document in
        specified collection
        <ol>
          <li>
            Select collection from <em>dropdown</em>
          </li>
          <li>
            Click <em>'Import Markdown File'</em> button
          </li>
          <li>
            Select a <em>markdown</em> file
          </li>
        </ol>
      </Modal.SecondaryMessage>
      <Modal.ButtonsContainer>
        <DropdownContainer
          onClick={() => {
            toggleGroupSelector()
          }}
        >
          <span>{groupName}</span>
          <Icon icon="caretDown" color="var(--light-300)" />
          {isOpen ? (
            <DropdownContent>
              <CollectionSelector
                {...getCollectionSelectorPropsAndRef()}
                onSubmit={handleSelectGroupSubmit}
              />
            </DropdownContent>
          ) : null}
        </DropdownContainer>

        <Button onClick={handleImportMarkdown} autoFocus variant="primary">
          Import Markdown File
        </Button>
      </Modal.ButtonsContainer>
    </Modal.Container>
  )
}
