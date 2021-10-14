import { LocalSettingsDoc, LocalSettings } from "../Database"

export type LocalSettingObject<SettingType> = {
  setValue: React.Dispatch<React.SetStateAction<SettingType>>
  requiresCustomDefaultSetter: boolean
}

export type LocalSettingsStore = {
  [SettingType in keyof LocalSettings]?: LocalSettingObject<SettingType>
}

export type LocalSettingHookOptions = { requiresCustomDefaultSetter?: boolean }

export type LocalSettingsContextValue = LocalSettings & {
  updateLocalSetting: <K extends keyof LocalSettings>(
    key: K,
    value: LocalSettings[K]
  ) => Promise<LocalSettingsDoc>
}

export type LocalSettingsKeys = keyof LocalSettings
