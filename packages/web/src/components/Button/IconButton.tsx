import React from "react"
import styled from "styled-components/macro"

import { Icon, IconNames } from "../Icon"
import { Button } from "./Button"

const IconButtonUnstyled: React.FC<{ icon: IconNames }> = ({
  icon,
  ...rest
}) => (
  <Button {...rest}>
    <Icon icon={icon} />
  </Button>
)

export const IconButton = styled(IconButtonUnstyled)`
  padding: 0 var(--spacing3);
`
