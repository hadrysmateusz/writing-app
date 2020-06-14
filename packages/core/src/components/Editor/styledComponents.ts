import styled from "styled-components/macro"

export const OuterContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100vh;
  font-size: 20px;
  box-sizing: content-box;
`

export const InnerContainer = styled.div`
  padding: 0 60px;
  margin: 80px auto 0;
  max-width: 680px;
  width: 100%;
`

export const EditableContainer = styled.div`
  width: 100%;
  font-size: 16px;
  line-height: 26px;
  color: #f3f3f3;
`

export const InsertBlockField = styled.div`
  height: 150px;
  cursor: text;
`
