import React from "react"
import { useSlate } from "slate-react"

import { Button } from "../Button"
import { serializeHTML } from "../../slate-helpers"

export const ExportButton: React.FC = () => {
  const editor = useSlate()

  const handleExport = () => {
    const html = serializeHTML(editor)
    console.log(html)
  }

  return <Button onClick={handleExport}>Export</Button>
}
