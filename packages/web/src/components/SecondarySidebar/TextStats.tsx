import { Container, Row, Value } from "./TextStats.styles"
import { useDocumentStats } from "./TextStats.hooks"

export const TextStats: React.FC = () => {
  const stats = useDocumentStats()

  if (!stats) return null

  const { chars, words, readingTimeMin, readingTimeSec } = stats

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

export default TextStats
