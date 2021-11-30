import Icon from "../Icon"

export const TabCloseButton: React.FC<{
  handleCloseTab: (e: React.MouseEvent) => void
}> = ({ handleCloseTab }) => {
  /* TODO: not sure if not showing the close button is the best solution but it's better than nothing (I could remove this when/if I add different tab types and the placeholder tab type so that a new document isn't created every time, even when nothing is written in the new tab) */
  return (
    <div className="tab-close-button" onClick={handleCloseTab}>
      <Icon icon="close" />
    </div>
  )
}
