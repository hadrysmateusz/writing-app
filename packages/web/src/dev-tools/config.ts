let config: any
const key = "config"

export type AppConfig = {
  logOperations: boolean
  logSelection: boolean
  logValue: boolean
  dbSync: boolean
  debugStyles: boolean
}

/**
 * Load the application configuration by merging the passed-in app defaults with values stored in localStorage
 * @param {Object} appDefaults config object to act as defaults for the app
 * @param {Function} callback function to be called when the config is loaded
 */
const loadConfig = (appDefaults: AppConfig, callback: () => void) => {
  try {
    console.groupCollapsed("LOADING CONFIG")
    const localConfig = loadFromStorage()
    console.log("default", appDefaults)
    console.log("local", localConfig)
    // TODO: when a feature toggle is removed, the corresponding value isn't removed from localStorage
    config = { ...appDefaults, ...localConfig } // config in localStorage should override the defaults
    console.log("merged", config)
    console.groupEnd()
  } catch (error) {
    console.warn("There was an issue with loading app configuration.")
    console.error(error)
    config = appDefaults
  } finally {
    callback()
  }
}

/**
 * Get config values from localStorage
 */
const loadFromStorage = () => {
  try {
    const value = window.localStorage.getItem(key)

    if (value === null) {
      return {}
    } else {
      return JSON.parse(value)
    }
  } catch (error) {
    window.localStorage.removeItem(key)
    return {}
  }
}

/**
 * Save current config values in localStorage
 */
const persist = () => window.localStorage.setItem(key, JSON.stringify(config))

/**
 * Enable a feature locally
 */
function enable(name: string) {
  config[name] = true
  persist()
}

/**
 * Disable a feature locally
 */
function disable(name: string) {
  config[name] = false
  persist()
}

export { config, enable, disable, loadConfig }
