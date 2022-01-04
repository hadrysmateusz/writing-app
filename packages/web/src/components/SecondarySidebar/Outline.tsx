import { useTabsState } from "../TabsProvider"

import { useDocumentOutline } from "./Outline.hooks"
import { OutlineContainer, OutlineItem, OutlineIcon } from "./Outline.styles"

export const Outline: React.FC = () => {
  const { currentDocumentId } = useTabsState()
  const outline = useDocumentOutline()

  const isEmpty = outline.tree.length === 0

  return (
    <OutlineContainer>
      {isEmpty ? (
        <OutlineEmptyState />
      ) : (
        outline.tree.map((item) => (
          // TODO: replace the key with something that is guaranteed to be unique
          <OutlineItem
            key={currentDocumentId + item.level + item.textContent}
            level={item.level}
            baseLevel={outline.baseLevel}
          >
            <OutlineIcon>H{item.level}</OutlineIcon>
            {item.textContent}
          </OutlineItem>
        ))
      )}
    </OutlineContainer>
  )
}

const OutlineEmptyState: React.FC = () => (
  <div className="Outline_EmptyState">No headings in current document</div>
)
