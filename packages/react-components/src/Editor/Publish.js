import React, { useRef, useEffect } from "react"

import { ROUTES, HOSTING_URL, MEDIUM_API_AUTH_URL } from "@writing-tool/constants"
import { openPopupWindow } from "@writing-tool/utils"

export const Publish = ({ children }) => {
	const popupWindow = useRef(null)

	useEffect(() => {
		const receiveMessage = (e) => {
			// TODO: verify that the state string returned matches the original
			console.log(e)
		}
		window.addEventListener("message", receiveMessage, false)
		return () => window.addEventListener("message", receiveMessage, false)
	}, [])

	async function initMediumAuthentication() {
		const client_id = "faa8741a7dd9"
		const scope = "basicProfile,publishPost"
		const state = "asdf" // TODO: proper state string generation
		const response_type = "code"
		const redirect_uri = encodeURIComponent(HOSTING_URL + ROUTES.MEDIUM_AUTH_CALLBACK)

		const popup_url =
			MEDIUM_API_AUTH_URL +
			`?client_id=${client_id}` +
			`&scope=${scope}` +
			`&state=${state}` +
			`&response_type=${response_type}` +
			`&redirect_uri=${redirect_uri}`

		openPopupWindow(
			popup_url,
			"Medium Auth",
			"toolbar=no,menubar=no,width=600,height=700,top=100,left=100",
			popupWindow.current
		)
	}

	async function publish() {
		initMediumAuthentication()
	}

	return <button onClick={publish}>{children}</button>
}
