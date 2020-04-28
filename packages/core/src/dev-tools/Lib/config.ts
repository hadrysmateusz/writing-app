let config
const key = "config"

/**
 * Load the application configuration by merging the passed-in app defaults with values stored in localStorage
 * @param {Object} appDefaults config object to act as defaults for the app
 * @param {Function} callback function to be called when the config is loaded
 */
const loadConfig = (appDefaults, callback) => {
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
    config = {}
  } finally {
    // call the callback function ()
    callback()
  }
}

/**
 * Get config values from localStorage
 */
const loadFromStorage = () => {
  try {
    return JSON.parse(window.localStorage.getItem(key))
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
function enable(name) {
  config[name] = true
  console.log(`CONFIG: Enabled ${name}`, config)
  persist()
}

/**
 * Disable a feature locally
 */
function disable(name) {
  config[name] = false
  console.log(`CONFIG: Disabled ${name}`, config)
  persist()
}

export { config, enable, disable, loadConfig }
