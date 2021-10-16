import { withDelayRender } from "../../withDelayRender"
import styled, { keyframes } from "styled-components/macro"

const AppLoadingIndicator = withDelayRender(1000)(() => <div>Loading</div>)

const AppLoadingState = () => (
  <AppLoadingContainer>
    <AppLoadingIndicator />
  </AppLoadingContainer>
)

const breathingColor = keyframes`
  from { color: #999999; }
	to { color: #f6f6f6; }
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