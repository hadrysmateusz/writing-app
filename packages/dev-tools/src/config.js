let config
const key = "config"

const loadConfig = (_config, callback) => {
	console.groupCollapsed("LOADING CONFIG")
	const localConfig = getConfigFromLocalStorage()
	console.log("default config" + _config)
	console.log("local config" + localConfig)
	// TODO: when a feature toggle is removed, the corresponding value isn't removed from localStorage
	config = { ..._config, ...localConfig } // config in localStorage should override the defaults
	console.log("merged config" + config)
	console.groupEnd()
	// call the callback function ()
	callback()
}

const getConfigFromLocalStorage = () => {
	try {
		return JSON.parse(window.localStorage.getItem(key))
	} catch (error) {
		window.localStorage.removeItem(key)
		return {}
	}
}

const persist = () => window.localStorage.setItem(key, JSON.stringify(config))

function enable(name) {
	config[name] = true
	console.log(`enabled ${name}`, config)
	persist()
}

function disable(name) {
	config[name] = false
	console.log(`disabled ${name}`, config)
	persist()
}

export { config, enable, disable, loadConfig }
