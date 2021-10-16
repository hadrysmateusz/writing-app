import { LocalSettingsDoc, LocalSettings } from "../Database"

export type LocalSettingObject<SettingType> = {
  setValue: React.Dispatch<React.SetStateAction<SettingType>>
  requiresCustomDefaultSetter: boolean
}

export type LocalSettingHookOptions = { requiresCustomDefaultSetter?: boolean }

export type LocalSettingsContextValue = {
  updateLocalSetting: <K extends keyof LocalSettings>(
    key: K,
    value: LocalSettings[K]
  ) => Promise<LocalSettingsDoc>
  getLocalSetting: <K extends keyof LocalSettings>(
    key: K
  ) => Promise<LocalSettings[K]>
}
