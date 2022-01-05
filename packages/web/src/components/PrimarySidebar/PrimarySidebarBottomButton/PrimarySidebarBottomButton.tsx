import { Icon, IconNames } from "../../Icon"

import { PrimarySidebarBottomButtonSC } from "./PrimarySidebarBottomButton.styles"

export const PrimarySidebarBottomButton: React.FC<{
  icon: IconNames
  handleClick: () => void
}> = ({ icon, handleClick, children }) => (
  <PrimarySidebarBottomButtonSC onClick={handleClick}>
    <Icon icon={icon} color="var(--light-200)" style={{ fontSize: "1.5em" }} />
    <div>{children}</div>
  </PrimarySidebarBottomButtonSC>
)
