import { useEffect, useState } from "react"
import { unified } from "unified"
import latin from "retext-latin"
import size from "unist-util-size"
import { usePlateSelectors } from "@udecode/plate-core"

import { serializeText } from "../../slate-helpers"
import { useTabsState } from "../TabsProvider"

// TODO: add option to customise WPM reading speed
const WPM = 275

type TextStatsType = {
  chars: number
  words: number
  readingTimeMin: number
  readingTimeSec: number
}

const DEFAULT_STATE: TextStatsType = {
  chars: 0,
  words: 0,
  readingTimeMin: 0,
  readingTimeSec: 0,
}

export const useDocumentStats = (): TextStatsType | null => {
  const { currentDocumentId } = useTabsState()
  const editorValue = usePlateSelectors(currentDocumentId).value()

  const [stats, setStats] = useState<TextStatsType | null>(DEFAULT_STATE)

  // TODO: debounce/throttle the calculations
  useEffect(() => {
    if (!editorValue) {
      setStats(null)
      return
    }

    const text = serializeText(editorValue)

    var tree = unified().use(latin).parse(text)

    const _chars = text.length // TODO: filter newlines (will need to account for different line endings)
    const _words = size(tree, "WordNode")
    // const _sentences = size(tree, "SentenceNode")
    // This uses words as defined by 5 characters instead of actual space-separated words TODO: make sure this is a good approach
    const _readingTime = Math.round(_chars / 5 / (WPM / 60)) // In seconds
    const [_readingTimeMin, _readingTimeSec] =
      getMinutesAndSecondsFromSeconds(_readingTime) // Calculate derivative time in minutes and seconds

    setStats({
      chars: _chars,
      words: _words,
      readingTimeMin: _readingTimeMin,
      readingTimeSec: _readingTimeSec,
    })
  }, [editorValue])

  return stats
}

// TODO: export as general util
const getMinutesAndSecondsFromSeconds = (seconds: number) => {
  const calculatedMinutes = Math.floor(seconds / 60)
  const calculatedSeconds = seconds - calculatedMinutes * 60
  return [calculatedMinutes, calculatedSeconds]
}
