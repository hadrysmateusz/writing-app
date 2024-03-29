import React, { useRef, useEffect, useState } from "react"

import {
  ROUTES,
  API_ROUTES,
  MESSAGE_TYPES,
  MEDIUM_API_AUTH_URL,
  API_BASE_URL_DEV,
  FRONTEND_BASE_URL_PROD,
} from "shared"

import { openPopupWindow } from "../utils"

// TODO: better handle different urls and config in dev and prod

export const ConnectWithMedium = () => {
  const popupWindow = useRef(null)
  const [oAuthState] = useState("asdf") // TODO: generate proper state string
  const redirect_uri = encodeURIComponent(
    FRONTEND_BASE_URL_PROD + ROUTES.MEDIUM_AUTH_CALLBACK
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function shouldIgnore(event) {
      // verify that the message type is the one I'm interested in
      // trycatch block prevents false positives
      try {
        if (event.data.type === MESSAGE_TYPES.MEDIUM_AUTH_CALLBACK) {
          console.log("Received message from auth popup")
          return false
        } else {
          return true
        }
      } catch (error) {
        console.warn(error)
        return true
      }
    }

    async function fetchMediumAccessToken(code: string) {
      console.log("Fetching medium access token...")

      const apiRes = await fetch(
        API_BASE_URL_DEV + API_ROUTES.MEDIUM_AUTHORIZE,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Accept-Charset": "utf-8",
          },
          body: JSON.stringify({
            code,
            redirect_uri,
          }),
        }
      )

      const data = await apiRes.json()
      console.log(data)
    }

    function validate(event) {
      const { data } = event
      // TODO: add all other valid origins
      // verify that the message comes from a valid origin
      if (![FRONTEND_BASE_URL_PROD].includes(event.origin)) {
        throw new Error("Message comes from invalid origin: " + event.origin)
      }
      // if there was an error, re-throw it
      if (data.error) {
        throw data.error
      }
      // verify that the state string returned matches the original
      if (typeof data.state !== "string" || data.state !== oAuthState) {
        throw new Error("Returned state string doesn't match the original")
      }
    }

    async function receiveMessage(event) {
      console.log("received message")
      try {
        // check whether the message should be ignored
        if (shouldIgnore(event)) return
        // this will throw if the message is invalid
        validate(event)
        const token = await fetchMediumAccessToken(event.code)
        console.log(token)
      } catch (error) {
        console.error(error)
        setError(error.message || "Unknown Error")
      }
    }

    window.addEventListener("message", receiveMessage, false)
    return () => window.addEventListener("message", receiveMessage, false)
  }, [error, oAuthState, redirect_uri])

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

    const onClose = (message: string) => {
      const msg = `The popup window was closed: ${message}`
      console.log(msg)
      setError(msg)
    }

    openPopupWindow(
      popup_url,
      "Medium Auth",
      "toolbar=no,menubar=no,width=600,height=700,top=100,left=100",
      popupWindow.current,
      onClose
    )
  }

  return (
    <button onMouseDown={initMediumAuthentication}>Connect with Medium</button>
  )
}
