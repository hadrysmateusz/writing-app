import styled, { keyframes } from "styled-components/macro"

import { withDelayRender } from "../../withDelayRender"

// TODO: probably generalize this component as something like FullscreenLoadingState and extract it higher up

export const AppLoadingIndicator = withDelayRender(1000)(() => (
  <div>Loading...</div>
))

export const AppLoadingState = () => (
  <AppLoadingContainer>
    <AppLoadingIndicator />
  </AppLoadingContainer>
)

const breathingColor = keyframes`
  from { color: var(--light-200); }
	to { color: var(--light-600); }
`

const AppLoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  background: var(--bg-200);
  text-transform: uppercase;
  font: 500 40px Poppins;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: alternate 1.5s infinite ${breathingColor};
`

export default AppLoadingState
