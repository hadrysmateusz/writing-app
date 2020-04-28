import React from "react"

import { dispatchDevToolsEvent } from "../../Lib/events"

export const TriggerEvent = ({ name }) => {
  return (
    <div>
      <button onMouseDown={() => dispatchDevToolsEvent(name)}>{name}</button>
    </div>
  )
}
