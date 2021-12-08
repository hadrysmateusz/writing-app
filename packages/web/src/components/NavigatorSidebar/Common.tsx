import styled from "styled-components/macro"

// TODO: merge with SidebarCommon

export const SectionContainer = styled.div`
  :not(:first-child) {
    margin-top: var(--navigator-sidebar-spacing);
  }
`
export const SectionHeader = styled.div<{ withHover?: boolean }>`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 0 18px 5px;
  user-select: none;

  color: var(--light-300);

  position: relative;

  width: 100%;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  display: flex;

  > :last-child {
    display: none;
  }

  &:hover > :last-child {
    display: flex;
    position: absolute;
    right: 18px;
    top: -3px;
  }

  :hover {
    ${(p) => (p.withHover ? "color: var(--light-400); cursor:pointer;" : null)}
  }
`
