import React, { useCallback, useMemo } from "react"
import { usePlateEditorRef, usePlateEventId } from "@udecode/plate-core"

import createContext from "../../../utils/createContext"

import { getPromptModalContent, usePromptModal } from "../../PromptModal"

import { getAndUpsertLink } from "../Toolbars"

import { LinkModalContextValue } from "./types"

export const [LinkModalContext, useLinkModal] =
  createContext<LinkModalContextValue>()

const LinkModalContent = getPromptModalContent({
  promptMessage: "Paste link url",
  submitMessage: "Add Link",
  inputPlaceholder: "Link url",
})

// TODO: remove duplication with ImageModal code
// TODO: support other link operations, like changing url or text
export const LinkModalProvider: React.FC = ({ children }) => {
  const editor = usePlateEditorRef(usePlateEventId("focus"))
  // const editor = useSlateStatic()
  // const [selection, setSelection] = useState<Range | null>(null)

  // const onBeforeOpen = useCallback(() => {
  //   // TODO: save selection state (perhaps override apply and everyone a "set_selection" operation with {newProperties: null} is applied, save the selection (but it's so low-level that I don't know where to store and how to restore it, so maybe a wrapper function will be required (I could store it in local storage, but that might have issues between restarts)))
  //   setSelection(editor.selection)
  //   ReactEditor.deselect(editor)
  //   ReactEditor.blur(editor)
  // }, [editor])

  // const onAfterClose = useCallback(() => {
  //   if (selection) {
  //     setSelection(selection)
  //     ReactEditor.focus(editor)
  //   }
  // }, [editor, selection])

  const { Modal, ...toggleableProps } = usePromptModal("")

  /**
   * Convenience function for opening the modal and getting the url from it
   */
  const getLinkUrl = useCallback(
    async (prevUrl: string) => {
      const url = await toggleableProps.open({ initialValue: prevUrl })
      return typeof url === "string" ? url : null
    },
    [toggleableProps]
  )

  /**
   * Convenience method handling the entire flow for opening the modal and upserting link with resulting url
   */
  const upsertLinkFromModal = useCallback(async () => {
    if (!editor) {
      console.warn("editor is undefined")
      return
    }
    await getAndUpsertLink(editor, getLinkUrl)
  }, [editor, getLinkUrl])

  const value = useMemo(
    () => ({ ...toggleableProps, upsertLinkFromModal, getLinkUrl }),
    [getLinkUrl, toggleableProps, upsertLinkFromModal]
  )

  return (
    <LinkModalContext.Provider value={value}>
      <Modal component={LinkModalContent} />
      {children}
    </LinkModalContext.Provider>
  )
}
