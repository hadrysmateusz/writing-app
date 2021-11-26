import { createContext } from "../../utils"
import { TabsAction } from "./tabsSlice"

import { DocumentsAPI, GroupsAPI, TagsAPI, MainState } from "./types"

export const [MainStateContext, useMainState] = createContext<MainState>()

export const [GroupsAPIContext, useGroupsAPI] = createContext<GroupsAPI>()

export const [DocumentsAPIContext, useDocumentsAPI] = createContext<
  DocumentsAPI
>()

export const [TagsAPIContext, useTagsAPI] = createContext<TagsAPI>()

export const [TabsDispatchContext, useTabsDispatch] = createContext<
  React.Dispatch<TabsAction>
>()
