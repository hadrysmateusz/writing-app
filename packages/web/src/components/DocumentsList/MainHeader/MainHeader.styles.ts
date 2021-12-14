import styled from "styled-components/macro"

export const SortingMenuItemInnerWrapper = styled.span<{ isActive: boolean }>`
  font-weight: ${(p) => (p.isActive ? `bold` : `normal`)};
`

export const Wrapper = styled.div`
  --padding-x: 24px;
  --padding-y: 20px;

  padding: var(--padding-y) var(--padding-x);

  .MainHeader_MainText {
    color: var(--light-600);
    font-size: 12px;
    font-weight: bold;

    margin-bottom: 8px;
  }

  .MainHeader_Details {
    color: var(--light-400);
    font-size: 10px;
    font-weight: normal;
  }

  .MainHeader_HorizontalContainer {
    display: grid;
    grid-template-columns: auto repeat(2, min-content);
    /* gap: 8px; */
  }

  .MainHeader_ButtonContainer {
    display: flex;
    justify-content: center;
    align-items: center;

    --padding-x: 4px;
    padding: 0 var(--padding-x);
    margin-right: calc(-1 * var(--padding-x));
    margin-left: 8px;

    font-size: 18px;
    cursor: pointer;

    color: var(--light-100);

    :hover {
      color: var(--light-400);
    }
  }
`
