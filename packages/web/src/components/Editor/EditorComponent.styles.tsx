import styled from "styled-components/macro"
import { customScrollbar } from "../../style-utils"

export const OuterContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-size: 20px;
  box-sizing: content-box;
  ${customScrollbar}
  position: relative;

  .Editor_TopShadow {
    position: sticky;
    z-index: 500;
    height: 40px;
    width: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(var(--dark-200) 4%, #19191900 70%);
  }
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
  padding-bottom: 140px;

  color: var(--light-600);
  *::selection {
    color: inherit;
    background: var(--selection-color);
  }
`

// export const InsertBlockField = styled.div`
//   height: 150px;
//   cursor: text;
// `
