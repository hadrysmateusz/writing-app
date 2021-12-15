import styled from "styled-components/macro"

// TODO: extract and reuse styles from SidebarDocumentItems

export const TagListItemContainer = styled.div`
  display: flex;
  align-items: center;

  padding: 2px 14px;
  font-size: 12px;
  cursor: pointer;

  transition: background-color 200ms ease;

  /* 
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
   */
  padding: 10px 12px 12px;
  border-radius: 4px;
  user-select: none;

  :hover {
    background: var(--bg-highlight);
  }

  .Tag_LeftSideContainer {
    width: 100%;
  }

  /* .Tag_LeftSideContainer:hover {
    .Tag_Name {
      color: white;
    }
  } */

  .Tag_Name {
    margin-right: auto;
    flex-grow: 1;

    color: var(--light-500);
    font-weight: 500;
    font-family: "Poppins";
    line-height: 18px;

    transition: color 200ms ease;
  }

  .Tag_Details {
    --line-height: 16px;
    line-height: var(--line-height);
    max-height: calc(2 * var(--line-height));
    overflow: hidden;

    /* TODO: improve these styles */
    overflow-wrap: break-word;
    line-break: anywhere;
    line-clamp: 2;

    color: var(--light-300);
    font-size: 11px;
    padding-top: 1px;
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

    transition: color 200ms ease;

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
