import React, { useEffect } from "react"

import { MESSAGE_TYPES } from "@writing-tool/constants"

/**
 * this is the redirect page for the Medium OAuth popup,
 * it will send the searchParams to the opening window
 * to be handled in the web app
 */
export default () => {
	useEffect(() => {
		// intentionally outside the trycatch block
		// TODO: this error should show a custom error state and be reported to error reporting service
		if (!window.opener) {
			throw Error("Medium Auth Redirect Page has no window.opener")
		}

		try {
			const params = new URLSearchParams(window.location.search)

			if (params.has("error")) {
				throw Error("Medium Error:" + params.error)
			}
			if (!params.has("state") || !params.has("code")) {
				throw Error("Response is missing required search parameters")
			}

			const state = params.get("state")
			const code = params.get("code")

			// TODO: verify that using window.opener is safe, it might be necessary to hardcode a url or use a different solution
			// send the parameters to the opening window
			window.opener.postMessage({ type: MESSAGE_TYPES.MEDIUM_AUTH_CALLBACK, state, code })
		} catch (error) {
			console.log(error)
			// send the error message to the opening window
			window.opener.postMessage({ type: MESSAGE_TYPES.MEDIUM_AUTH_CALLBACK, error })
		}

		// // close the popup
		window.close()
	})
	// some text to show the user
	// TODO: improve this loading state
	return <p>Please wait...</p>
}
