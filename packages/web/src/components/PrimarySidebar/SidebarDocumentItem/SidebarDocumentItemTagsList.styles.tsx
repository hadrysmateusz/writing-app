import styled from "styled-components/macro"

// TODO: remove duplication with the one in Keywords.styles and make a default basic tags container
export const TagsContainer = styled.div`
  --tags-gap: 5px /* 10px */;

  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--tags-gap);
`

export const TagAltContainer = styled.div`
  /* font-size: 11px;
  color: var(--light-100); */
  font-size: 10px;
  color: var(--light-400);
  background: transparent;
  border: 1px solid var(--dark-500);
  border-radius: 3px;
  padding: 2px 4px;
`
