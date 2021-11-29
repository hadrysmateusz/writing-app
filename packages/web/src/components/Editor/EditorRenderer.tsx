import React from "react"

import { useTabsState } from "../MainProvider"
import { EditorTabsBar } from "../EditorTabs"

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
  const { tabs, currentTab } = useTabsState()

  // Handles rendering the editor based on tab type
  function renderCorrectEditor() {
    let currentTabObj = tabs[currentTab]
    // TODO: probably precompute this and expose in useTabsState hook
    const currentTabType = currentTabObj.tabType

    if (currentTabType === "cloudNew") {
      return <DummyEditor />
    }
    if (currentTabType === "cloudDocument") {
      return <CloudEditor currentDocumentId={currentTabObj.documentId} />
    }
    if (currentTabType === "localDocument") {
      return <LocalEditor currentDocumentPath={currentTabObj.path} />
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
