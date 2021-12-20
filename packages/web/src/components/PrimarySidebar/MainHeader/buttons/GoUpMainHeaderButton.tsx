import { parseSidebarPath, usePrimarySidebar } from "../../../ViewState"

import { MainHeaderButton } from "./MainHeaderButton"

export const GoUpMainHeaderButton: React.FC<{ goUpPath?: string }> = ({
  goUpPath,
}) => {
  const { switchSubview } = usePrimarySidebar()

  const handleGoUpButtonClick = () => {
    if (!goUpPath) {
      return
    }

    console.log("handleGoUpButtonClick")

    const parsedSidebarPath = parseSidebarPath(goUpPath)

    if (!parsedSidebarPath) {
      return
    }

    const { view, subview, id } = parsedSidebarPath

    // TODO: figure out some fallbacks in case the arguments are invalid
    switchSubview(view as any, subview as any, id)
  }

  return goUpPath !== undefined ? (
    <MainHeaderButton
      tooltip="Go to parent collection"
      icon="arrow90DegUp"
      action={handleGoUpButtonClick}
    />
  ) : null
}
