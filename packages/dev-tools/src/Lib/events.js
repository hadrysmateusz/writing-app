const events = {}

/**
 * Adds a handler function for an event
 * These events can be dispatched from inside dev-tools
 * Allows dev tools to trigger functionality in the app
 *
 * @param {String} name name of the event
 * @param {Function} handler handler function for this event (handlers receive the event name as first argument)
 */
export function addDevToolsEventHandler(name, handler) {
	if (!(name in events)) {
		// create an array to store handlers for this event
		events[name] = []
	}

	// exit if this function was already registered as a handler for this event
	if (events[name].includes(handler)) return
	// add this function as a handler for this event
	events[name].push(handler)
}

export function removeDevToolsEventHandler(name, handler) {
	if (!(name in events)) {
		console.log(
			`DEV TOOLS: attempted to remove a handler for an unregistered event: ${name}`
		)
		return
	}

	// remove the handler from the handlers array of this event
	events[name] = events[name].filter((fn) => fn !== handler)
}

/**
 * Calls all the event handlers for a given event
 * @param {String} name name of the event
 */
export function dispatchDevToolsEvent(name) {
	if (!(name in events)) {
		throw new Error(`An unregistered DevTools event (${name}) was dispatched`)
	} else {
		console.log(`Dispatched DevTools event: ${name} Handlers: ${events[name].length}`)
	}

	// iterate over the handlers for this event and invoke them all
	events[name].forEach((handler) => {
		handler(name)
	})
}
