import { LocalSettingsContextValue } from "./types"
import createContext from "../../utils/createContext"

export const [LocalSettingsContext, useLocalSettings] = createContext<
  LocalSettingsContextValue
>()

export class LocalSettingsDocError extends Error {
  constructor(message) {
    super(message)
    this.name = "LocalSettingsDocError"
  }
}
