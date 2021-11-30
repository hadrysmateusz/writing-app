import styled from "styled-components/macro"

import { ellipsis } from "../../style-utils"

export const EditorTabContainer = styled.div<{
  isActive?: boolean
  keep: boolean
}>`
  --bg-color-default: var(--bg-100);
  --bg-color-active: var(--bg-200);
  --bg-color: ${({ isActive }) =>
    isActive ? "var(--bg-color-active)" : "var(--bg-color-default)"};

  ${(p) => (!p.keep ? "font-style: italic;" : null)}

  border-radius: var(--tab-corner-radius) var(--tab-corner-radius) 0 0;
  height: var(--tab-size);
  padding: 0 16px;
  font-size: 12px;

  background: var(--bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  max-width: 800px;
  min-width: ${({ isActive }) => (isActive ? "fit-content" : "0")};

  .tab-icon {
    color: ${({ isActive }) =>
      isActive ? "var(--light-300)" : "var(--light-100)"};
    padding-right: 10px;
    margin-left: -4px;
  }

  .tab-title {
    color: ${({ isActive }) =>
      isActive ? "var(--light-600)" : "var(--light-300)"};
    flex-shrink: 1;
    ${ellipsis}
  }

  .tab-group {
    flex-shrink: 5;
    margin-left: 9px;
    font-size: 10px;
    color: ${({ isActive }) =>
      isActive ? "var(--light-200)" : "var(--light-100)"};
    ${ellipsis}
  }

  .tab-close-button {
    position: absolute;
    right: 0;

    margin: 4px 5px;
    padding: 3px;
    border-radius: 3px;

    background: ${({ isActive }) =>
      isActive ? "var(--bg-200)" : "var(--bg-100)"};
    opacity: 0;

    font-size: 14px;

    color: var(--light-100);
    &:hover {
      color: white;
    }
  }

  &:hover {
    .tab-close-button {
      opacity: 1;
    }
    .tab-title {
      color: ${({ isActive }) =>
        isActive ? "var(--light-600)" : "var(--light-400)"};
    }
    .tab-group {
      color: ${({ isActive }) =>
        isActive ? "var(--light-200)" : "var(--light-200)"};
    }
  }
`
