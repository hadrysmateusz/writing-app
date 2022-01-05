import styled from "styled-components/macro"

import { Icon, IconNames } from "../Icon"

export const TreeItemIcon: React.FC<{
  icon?: IconNames
  style?: React.CSSProperties
}> = ({ icon, style }) => {
  return icon ? (
    <IconContainer style={style}>
      <Icon icon={icon} />
    </IconContainer>
  ) : null
}

const IconContainer = styled.div<{ isHidden?: boolean }>`
  margin-right: 8px;
  color: var(--dark-600);
  font-size: 1.4em;
  ${(p) => p.isHidden === true && `opacity: 0;`}
`
