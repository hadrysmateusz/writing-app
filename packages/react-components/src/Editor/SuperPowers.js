import React, { useRef, useEffect, useState } from "react"

import { openPopupWindow } from "@writing-tool/utils"
import {
	ROUTES,
	API_ROUTES,
	HOSTING_URL,
	MEDIUM_API_AUTH_URL,
	CLOUD_FUNCTIONS_BASE_URL,
	MESSAGE_TYPES
} from "@writing-tool/constants"

export const SuperPowers = ({ children }) => {
	const popupWindow = useRef(null)
	const [oAuthState] = useState("asdf") // TODO: generate proper state string
	const redirect_uri = encodeURIComponent(HOSTING_URL + ROUTES.MEDIUM_AUTH_CALLBACK)

	useEffect(() => {
		const receiveMessage = async (event) => {
			try {
				const { type, code, state, error } = event.data

				// TODO: add all other valid origins
				// verify that the message comes from a valid origin
				if (![HOSTING_URL].includes(event.origin)) return
				// verify that the message type is the one I'm interested in
				if (type !== MESSAGE_TYPES.MEDIUM_AUTH_CALLBACK) return
				// if there was an error, rethrow it
				if (error) throw new Error(error)
				// verify that the state string returned matches the original
				if (typeof state !== "string" || state !== oAuthState) {
					throw new Error("Returned state string doesn't match the original")
				}

				console.log(event)

				const apiRes = await fetch(CLOUD_FUNCTIONS_BASE_URL + API_ROUTES.MEDIUM_AUTHORIZE, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Accept-Charset": "utf-8"
					},
					body: {
						code,
						redirect_uri
					}
				})

				const data = await apiRes.json()
			} catch (error) {
				// TODO: handle errors (display error state)
			}
		}
		window.addEventListener("message", receiveMessage, false)
		return () => window.addEventListener("message", receiveMessage, false)
	}, [])

	async function initMediumAuthentication() {
		const client_id = "faa8741a7dd9"
		const scope = "basicProfile,publishPost"
		const state = oAuthState
		const response_type = "code"

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

	async function enableSuperPowers() {
		initMediumAuthentication()
	}

	return <button onClick={enableSuperPowers}>{children}</button>
}
