import styled from "styled-components/macro"
import { customScrollbar } from "../../style-utils"

export const OutermosterContainer = styled.div`
  min-width: 500px; // TODO: probably change this with media queries
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-rows: var(--tab-size) 1fr;
`

export const OutermostContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-200);
`

export const OuterContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-size: 20px;
  box-sizing: content-box;
  ${customScrollbar}
`

export const InnerContainer = styled.div`
  padding: 0 60px;
  margin: 120px auto 0;
  max-width: 800px;
  min-height: 0;
  width: 100%;
`

export const EditableContainer = styled.div`
  min-height: 0;
  width: 100%;
  font-size: 16px;
  line-height: 26px;
  color: #f3f3f3;
  *::selection {
    color: inherit;
    background: #9cb8c5;
  }
  padding-bottom: 140px;
`

export const InsertBlockField = styled.div`
  height: 150px;
  cursor: text;
`
