import React from "react"

export function ClearConsole() {
  return (
    <div>
      <button onMouseDown={() => console.clear()}>Clear Console</button>
    </div>
  )
}
