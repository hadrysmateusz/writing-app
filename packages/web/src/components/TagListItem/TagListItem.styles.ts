import styled from "styled-components/macro"

export const TagListItemContainer = styled.div`
  display: flex;
  align-items: center;

  padding: 2px 14px;
  font-size: 12px;

  .Tag_Name {
    padding: 8px 0;
    margin-right: auto;
    flex-grow: 1;

    color: var(--light-400);
    font-weight: 500;
    font-family: "Poppins";
    user-select: none;
    :hover {
      color: white;
    }
  }

  .Tag_ActionsContainer {
    margin-right: -6px;
    height: 100%;

    opacity: 0;
    transition: opacity 200ms ease-out;

    display: flex;
    color: var(--light-200);
    margin-left: auto;
  }

  .Tag_Action {
    padding: 8px 6px;
    cursor: pointer;

    :hover {
      color: var(--light-400);
    }
  }

  &:hover {
    .Tag_ActionsContainer {
      opacity: 1;
    }
  }
`
