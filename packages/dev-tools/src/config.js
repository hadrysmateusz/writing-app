// TODO: when a feature toggle is removed, the corresponding value isn't removed from localStorage

let config

const loadConfig = (_config, callback) => {
	console.log("loading config: ", _config)

	config = _config
	callback()
}

const key = "config"

// update config with what's in localStorage
try {
	Object.assign(config, JSON.parse(window.localStorage.getItem(key)))
} catch (error) {
	window.localStorage.removeItem(key)
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

console.log("config: ", config)

export { config, enable, disable, loadConfig }
