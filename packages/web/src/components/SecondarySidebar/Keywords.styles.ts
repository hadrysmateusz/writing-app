import styled from "styled-components/macro"

export const AddTagButton = styled.div`
  cursor: pointer;

  padding: 3px 6px;
  border: 1px solid;

  font-size: 11px;

  color: var(--light-500);
  background-color: var(--dark-500);
  border-color: var(--dark-600);
  border-radius: 2px;

  :hover {
    color: var(--light-600);
    background-color: var(--dark-600);
    border-color: var(--dark-600);
  }
`

export const TagsContainer = styled.div<{ isPopupOpen: boolean }>`
  --tags-gap: 8px;

  margin: 4px 0;

  display: flex;
  flex-wrap: wrap;
  gap: var(--tags-gap);

  position: relative;

  .Tags_Popup {
    display: ${(p) => (p.isPopupOpen ? "block" : "none")};

    position: absolute;
    top: calc(100% + var(--tags-gap));

    background: var(--dark-400);
    border: 1px solid var(--dark-500);
    border-radius: 3px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    padding: 6px 6px;
    width: 100%;

    font-size: 12px;
  }
`
