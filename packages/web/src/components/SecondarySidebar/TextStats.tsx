import { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { unified } from "unified"
import latin from "retext-latin"
import size from "unist-util-size"

import { serializeText } from "../../slate-helpers"

import { usePlateEventId, usePlateValue } from "@udecode/plate-core"

// TODO: add option to customise WPM reading speed
const WPM = 275

const TextStats: FC = () => {
  const editorValue = usePlateValue(usePlateEventId("focus"))

  const [chars, setChars] = useState(0)
  const [words, setWords] = useState(0)
  // const [sentences, setSentences] = useState(0)
  const [readingTime, setReadingTime] = useState(0)

  // TODO: debounce/throttle the calculations
  useEffect(() => {
    if (editorValue === undefined) return // TODO: handle this better (probably check higher up and ensure it's defined)

    const text = serializeText(editorValue)

    var tree = unified().use(latin).parse(text)

    const _chars = text.length // TODO: filter newlines (will need to account for different line endings)
    const _words = size(tree, "WordNode")
    // const _sentences = size(tree, "SentenceNode")
    // This uses words as defined by 5 characters instead of actual space-separated words TODO: make sure this is a good approach
    const _readingTime = Math.round(_chars / 5 / (WPM / 60)) // In seconds

    setChars(_chars)
    setWords(_words)
    // setSentences(_sentences)
    setReadingTime(_readingTime)
  }, [editorValue])

  const readingTimeMin = Math.floor(readingTime / 60)
  const readingTimeSec = readingTime - readingTimeMin * 60

  return (
    <Container>
      <Row>
        <div>Characters</div> <Value>{chars}</Value>
      </Row>
      <Row>
        <div>Words</div> <Value>{words}</Value>
      </Row>
      {/* <Row>
        <div>Sentences</div> <Value>{sentences}</Value>
      </Row> */}
      <Row>
        <div>Reading Time</div>{" "}
        <Value>
          {readingTimeMin} min {readingTimeSec} s
        </Value>
      </Row>
    </Container>
  )
}

const Container = styled.div`
  font-size: 12px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
`

const Value = styled.div`
  font-weight: 500;
`

export default TextStats
