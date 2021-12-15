import styled, { css } from "styled-components/macro"

export const DateModified = styled.div`
  padding-top: 4px;
  color: var(--light-100);
  font-size: 10px;
  line-height: 13px;
`

export const GroupName = styled.div`
  text-transform: uppercase;
  color: var(--light-100);
  font-size: 8.5px;
  font-weight: bold;
  margin-bottom: 4px;
`

export const Title = styled.div<{ isUnsynced: boolean }>`
  width: 100%;
  color: var(--light-500);
  font-family: Poppins;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .EditableText_editable {
    padding: 1px 2px 0;
  }
`

export const Snippet = styled.div`
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
`

export const MainContainer = styled.div<{ isCurrent: boolean }>`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  user-select: none;
  padding: 13px 12px 13px;
  border-radius: 4px;
  margin-bottom: 4px;

  cursor: pointer;

  transition: background-color 200ms ease;

  :hover {
    background: var(--bg-highlight);
  }

  ${(p) =>
    p.isCurrent &&
    css`
      background: var(--bg-highlight);
    `}
`

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
