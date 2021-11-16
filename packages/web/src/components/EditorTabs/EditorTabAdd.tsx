import styled from "styled-components/macro"

import { useMainState } from "../MainProvider"
import Icon from "../Icon"

const EditorTabAdd = () => {
  const { tabsDispatch } = useMainState()

  const handleClick = async (e) => {
    tabsDispatch({ type: "create-tab", tabType: "cloudNew", switch: true })
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
  padding: 3px;
  border-radius: 2px;

  color: var(--light-300);
  &:hover {
    color: var(--light-600);
    background: var(--bg-200);
  }
`

const EditorTabAddContainer = styled.div<{ isActive?: boolean }>`
  /* border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0; */
  font-size: 15px;

  width: var(--tab-size);
  height: var(--tab-size);

  color: var(--light-300);
  background: var(--dark-100);

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  min-width: fit-content;
  flex-shrink: 0;
`

export default EditorTabAdd
