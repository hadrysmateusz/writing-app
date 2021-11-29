import { withDelayRender } from "../../withDelayRender"

// TODO: style the loading and empty states

export const DocumentLoadingState = withDelayRender(1000)(() => (
  <div>Loading...</div>
))

export const DocumentEmptyState = withDelayRender(1000)(() => (
  // This div is here to prevent issues with split pane rendering, TODO: add proper empty state
  <div style={{ padding: "40px" }}>No document selected</div>
))
