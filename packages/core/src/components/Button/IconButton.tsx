import React from "react"
import styled from "styled-components/macro"

import Icon from "../Icon"
import { Button } from "./Button"

const IconButtonUnstyled: React.FC<{ icon: string }> = ({ icon, ...rest }) => (
  <Button {...rest}>
    <Icon icon={icon} />
  </Button>
)

export const IconButton = styled(IconButtonUnstyled)`
  padding: 0 var(--spacing3);
`
