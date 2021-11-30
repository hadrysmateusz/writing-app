import { EditorTabContainer } from "../EditorTab.styles"
import { TabCloseButton } from "../EditorTabCommon"

export const CloudNewEditorTab: React.FC<{
  isActive: boolean
  keep: boolean
  handleSwitchTab: (e: React.MouseEvent) => void
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ isActive, keep, handleSwitchTab, handleCloseTab }) => {
  return (
    <EditorTabContainer
      isActive={isActive}
      keep={keep}
      onClick={handleSwitchTab}
    >
      <div className="tab-title">Untitled</div>
      <TabCloseButton handleCloseTab={handleCloseTab} />
    </EditorTabContainer>
  )
}
