import React, { useEffect, useState } from "react"
import unified from "unified"
import latin from "retext-latin"
import size from "unist-util-size"
import vfile from "vfile"

import { serializeText } from "../../slate-helpers"
import { useEditorState } from "../EditorStateProvider"
import styled from "styled-components"

const TextStats: React.FC = () => {
  const { editorValue: editorContent } = useEditorState()

  const [chars, setChars] = useState(0)
  const [words, setWords] = useState(0)
  const [sentences, setSentences] = useState(0)
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    const text = serializeText(editorContent)

    var tree = unified().use(latin).parse(vfile(text))

    // console.log(text)
    // console.log(tree)
    // console.log("characters", text.length)
    // console.log("words")
    // console.log("sentences", size(tree, "SentenceNode"))
    // console.log(
    //   "reading time",
    //   `~${Math.max(1, Math.round(size(tree, "WordNode") / 275))}min`
    // )

    const _chars = text.length // TODO: filter newlines (probably will need os-specific code)
    const _words = size(tree, "WordNode")
    const _sentences = size(tree, "SentenceNode")
    const _readingTime = Math.max(1, Math.round(size(tree, "WordNode") / 275)) // TODO: a lot of improvements

    setChars(_chars)
    setWords(_words)
    setSentences(_sentences)
    setReadingTime(_readingTime)
  }, [editorContent])

  return (
    <div>
      <Row>
        <div>Characters</div> <Value>{chars}</Value>
      </Row>
      <Row>
        <div>Words</div> <Value>{words}</Value>
      </Row>
      <Row>
        <div>Sentences</div> <Value>{sentences}</Value>
      </Row>
      <Row>
        <div>Reading Time</div> <Value>~{readingTime} min</Value>
      </Row>
    </div>
  )
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
`

const Value = styled.div`
  font-weight: 500;
`

export default TextStats
