import styled from "styled-components/macro"

export const OutermosterContainer = styled.div`
  min-width: 500px; // TODO: probably change this with media queries
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-rows: var(--tab-size) 1fr;
`

export const OutermostContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-200);
`
