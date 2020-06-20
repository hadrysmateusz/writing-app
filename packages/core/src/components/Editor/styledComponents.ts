import styled from "styled-components/macro"

export const OutermostContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const OuterContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  font-size: 20px;
  box-sizing: content-box;
`

export const InnerContainer = styled.div`
  padding: 0 60px;
  margin: 120px auto 0;
  max-width: 800px;
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

export const TrashBanner = styled.div`
  background-color: #db4141;
  height: 40px;
  width: 100%;
  color: white;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
`
