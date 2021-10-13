import { LocalSettingsDoc, LocalSettings } from "../Database"

export type LocalSettingsState = LocalSettings & {
  updateLocalSetting: <K extends keyof LocalSettings>(
    key: K,
    value: LocalSettings[K]
  ) => Promise<LocalSettingsDoc>
}
