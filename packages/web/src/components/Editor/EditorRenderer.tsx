import React from "react"

import { EditorTabsBar } from "../EditorTabs"
import { useTabsState } from "../TabsProvider"

import {
  OutermostContainer,
  OutermosterContainer,
} from "./EditorRenderer.styles"
import { LocalEditor, CloudEditor, DummyEditor } from "./SpecializedEditors"
import { DocumentEmptyState } from "./HelperStates"
import { ImageModalProvider } from "./ImageModal"
import { LinkModalProvider } from "./LinkModal"

/**
 * Renders the editor if there is a document selected
 */
export const EditorRenderer: React.FC = () => {
  const { currentTabObject } = useTabsState()

  // Handles rendering the editor based on tab type
  function renderCorrectEditor() {
    // TODO: probably precompute this and expose in useTabsState hook
    const currentTabType = currentTabObject.tabType

    if (currentTabType === "cloudNew") {
      return <DummyEditor />
    }
    if (currentTabType === "cloudDocument") {
      return <CloudEditor currentDocumentId={currentTabObject.documentId} />
    }
    if (currentTabType === "localDocument") {
      return <LocalEditor currentDocumentPath={currentTabObject.path} />
    }
    return <DocumentEmptyState />
  }

  return (
    <OutermosterContainer>
      <EditorTabsBar />
      <OutermostContainer>
        <ImageModalProvider>
          <LinkModalProvider>{renderCorrectEditor()}</LinkModalProvider>
        </ImageModalProvider>
      </OutermostContainer>
    </OutermosterContainer>
  )
}
