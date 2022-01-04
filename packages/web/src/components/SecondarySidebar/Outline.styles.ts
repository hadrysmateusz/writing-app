import styled from "styled-components/macro"

export const OutlineContainer = styled.div`
  .Outline_EmptyState {
    font-size: 12px;
    color: var(--light-200);
    user-select: none;
  }

  :not(:empty) {
    padding-top: 4px;
  }
`

export const OutlineItem = styled.div<{ level: number; baseLevel: number }>`
  cursor: default;
  font-weight: normal;
  padding: 4px 0;
  padding-left: ${(p) => (p.level - p.baseLevel) * 16}px;
  color: var(--light-400);
  display: flex;
  font-size: 12px;
  align-items: center;
`

export const OutlineIcon = styled.span`
  margin-right: 6px;
  font-size: 12px;
  font-weight: bold;
  color: var(--dark-600);
`
