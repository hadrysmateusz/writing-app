import styled from "styled-components/macro"

export const PrimarySidebarBottomButtonSC = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;
  padding: 18px 20px 16px;

  user-select: none;
  cursor: pointer;

  font: 500 13px poppins;
  background: var(--bg-highlight);
  color: var(--light-500);

  :hover {
    color: white;
  }
`
