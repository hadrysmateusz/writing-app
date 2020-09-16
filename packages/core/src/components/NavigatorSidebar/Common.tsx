import styled from "styled-components/macro"

export const SectionContainer = styled.div`
  :not(:first-child) {
    margin-top: var(--navigator-sidebar-spacing);
  }
`
export const SectionHeader = styled.div`
  font-family: Poppins;
  font-weight: bold;
  font-size: 10px;
  color: #a3a3a3;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 0 18px 5px;

  user-select: none;
`
