// TODO: when a feature toggle is removed, the corresponding value isn't removed from localStorage

// import the file containing the actual values of the feature toggles
import featureToggles from "../featureToggles"

const key = "feature-toggles"

// update featureToggles with what's in localStorage
try {
	Object.assign(featureToggles, JSON.parse(window.localStorage.getItem(key)))
} catch (error) {
	window.localStorage.removeItem(key)
}

const persist = () => window.localStorage.setItem(key, JSON.stringify(featureToggles))

function enable(name) {
	console.log(featureToggles, name, "enabling")
	featureToggles[name] = true
	persist()
}

function disable(name) {
	console.log(featureToggles, name, "disabling")
	featureToggles[name] = false
	persist()
}

export default featureToggles
export { enable, disable }
