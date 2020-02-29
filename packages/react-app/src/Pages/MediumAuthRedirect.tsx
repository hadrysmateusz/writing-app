import React, { useEffect, useState } from "react"

import { MESSAGE_TYPES } from "@writing-tool/constants"

/**
 * this is the redirect page for the Medium OAuth popup,
 * it will send the searchParams to the opening window
 * to be handled in the web app
 */
const MediumAuthRedirect: React.FC = () => {
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// intentionally outside the inner trycatch block
		if (!window.opener) {
			// consider simply logging the error and redirecting to home page (maybe with some params that will display a flash message)
			setError("This page shouldn't be accessed directly")
			console.error("Medium Auth Redirect Page has no window.opener")
			return
		}

		try {
			const params = new URLSearchParams(window.location.search)

			if (params.has("error")) {
				throw Error("Medium Error:" + params.get("error"))
			}
			if (!params.has("state") || !params.has("code")) {
				throw Error("Response is missing required search parameters")
			}

			const state = params.get("state")
			const code = params.get("code")

			// TODO: verify that using window.opener is safe, it might be necessary to hardcode a url or use a different solution
			// send the parameters to the opening window
			window.opener.postMessage({
				type: MESSAGE_TYPES.MEDIUM_AUTH_CALLBACK,
				state,
				code
			})
		} catch (err) {
			console.log(err)
			setError(err.message)
			// send the error message to the opening window
			window.opener.postMessage({
				type: MESSAGE_TYPES.MEDIUM_AUTH_CALLBACK,
				error: err.message
			})
		} finally {
			// close the popup
			window.close()
		}
	}, [])

	// TODO: improve this loading state
	return error ? <p style={{ color: "red" }}>{error}</p> : <p>Please wait...</p>
}

export default MediumAuthRedirect
