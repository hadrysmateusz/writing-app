import { useMemo } from "react"

import { GenericDocGroupTree_Discriminated } from "../../../../types"

import { parseSidebarPath, usePrimarySidebar } from "../../../ViewState"

import { createParentGroupingItemSubviewPath } from "../../Local"

import { MainHeaderButton } from "./MainHeaderButton"

export const GoUpMainHeaderButton: React.FC<{ goUpPath?: string }> = ({
  goUpPath,
}) => {
  const { switchSubview } = usePrimarySidebar()

  const handleGoUpButtonClick = () => {
    if (!goUpPath) {
      return
    }

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

export const useGoUpPath = (
  genericGroupTree: GenericDocGroupTree_Discriminated | undefined,
  baseSubviewPath: string,
  fallbackSubviewPath: string
) => {
  const memoized = useMemo(
    () =>
      createParentGroupingItemSubviewPath(
        genericGroupTree,
        baseSubviewPath,
        fallbackSubviewPath
      ),
    [baseSubviewPath, fallbackSubviewPath, genericGroupTree]
  )

  return memoized
}
