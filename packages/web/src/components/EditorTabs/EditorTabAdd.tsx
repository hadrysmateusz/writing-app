import styled from "styled-components/macro"

import { useDocumentsAPI, useMainState } from "../MainProvider"
import Icon from "../Icon"

const EditorTabAdd = () => {
  const { createDocument } = useDocumentsAPI()
  const { openDocument } = useMainState()

  const handleClick = async (e) => {
    const document = await createDocument(null, undefined, {
      switchToDocument: false,
      switchToGroup: false,
    })
    openDocument(document.id, { inNewTab: true })
  }

  return (
    <EditorTabAddContainer onClick={handleClick}>
      <InnerContainer>
        <Icon icon="plus" />
      </InnerContainer>
    </EditorTabAddContainer>
  )
}

const InnerContainer = styled.div`
  /* width: 100%;
  height: 100%;
  padding: 8px; */
  /* margin-bottom: -4px; */
  padding: 3px;

  border-radius: 2px;
  color: #a3a3a3;
  &:hover {
    color: #f6f6f6;
    background: var(--bg-200);
  }
`

const EditorTabAddContainer = styled.div<{ isActive?: boolean }>`
  /* border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0; */
  width: var(--tab-size);
  height: var(--tab-size);
  /* padding: 0 16px; */
  font-size: 15px;
  color: #a3a3a3;
  background: #131313;

  /* &:hover {
    color: #f6f6f6;
    background: var(--bg-200);
  } */

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export default EditorTabAdd
