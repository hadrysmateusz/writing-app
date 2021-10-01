import { createContext } from "../../utils"

import { DocumentsAPI, GroupsAPI, MainState } from "./types"

export const [MainStateContext, useMainState] = createContext<MainState>()

export const [GroupsAPIContext, useGroupsAPI] = createContext<GroupsAPI>()

export const [DocumentsAPIContext, useDocumentsAPI] = createContext<
  DocumentsAPI
>()
