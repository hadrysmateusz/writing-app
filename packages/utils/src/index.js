/**
 * Checks if the app is running in a local environment like localhost
 */
export const isLocalhost = () => {
	const hostname = window.location.hostname
	if (
		["localhost", "[::1]", ""].includes(hostname) ||
		hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
	) {
		return true
	} else {
		return false
	}
}

/**
 * Opens the given url in a popup window. If a window with the same name is already open, it will be reused, otherwise a new window will be created.
 * @param {String} url url to be opened in the popup window
 * @param {String} name name of the window to open the url in
 * @param {String} windowFeatures string of comma separated options for the popup window
 * @param {Object} windowObj the window object of the popup
 * @returns the window object of the popup
 */
export const openPopupWindow = (url, name, windowFeatures, windowObj, onClose) => {
	const popupIsOpen = windowObj && !windowObj.closed
	const urlHasChanged = popupIsOpen ? windowObj.location.href !== url : true
	// open new window if it's not already open or open new url in window with the same name if url has changed
	if (!popupIsOpen || urlHasChanged) {
		windowObj = window.open(url, name, windowFeatures)
		var pollIsClosed = setInterval(function() {
			if (windowObj.closed) {
				clearInterval(pollIsClosed)
				onClose()
			}
		}, 1000)
	}

	// focus the popup (might not work in all browsers)
	windowObj.focus()
	// return the window object
	return windowObj
}
