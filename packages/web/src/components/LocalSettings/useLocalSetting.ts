import { useState, useEffect } from "react"

import defaults from "./default"

import { LocalSettingHookOptions, LocalSettingsStore } from "."

export const localSettingHookDefaultOptions = {
  requiresCustomDefaultSetter: false,
}

export function useLocalSetting<SettingType>(
  key: string,
  localSettingsStoreRef: React.MutableRefObject<LocalSettingsStore>,
  options: LocalSettingHookOptions = localSettingHookDefaultOptions
) {
  const {
    requiresCustomDefaultSetter = localSettingHookDefaultOptions.requiresCustomDefaultSetter,
  } = options

  const [value, setValue] = useState<SettingType>(defaults[key])

  useEffect(() => {
    if (!localSettingsStoreRef.current[key]) {
      localSettingsStoreRef.current[key] = {
        setValue,
        requiresCustomDefaultSetter,
      }
    }
  }, [key, localSettingsStoreRef, requiresCustomDefaultSetter])

  return value
}

export default useLocalSetting
