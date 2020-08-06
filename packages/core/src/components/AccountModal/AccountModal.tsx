import React from "react"
import styled from "styled-components/macro"

import { LogoutButton } from "../LogoutButton"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;
`

export const AccountModalContent: React.FC<{
  close: () => void
}> = ({ close }) => {
  return (
    <ModalContainer>
      <LogoutButton onBeforeLogout={close} />
    </ModalContainer>
  )
}
