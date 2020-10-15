import React, { useState } from "react"
import styled from "styled-components/macro"

import { LogoutButton } from "../Auth"
import { useUserdata } from "../Userdata"

const ModalContainer = styled.div`
  background: #252525;
  border: 1px solid #363636;
  padding: 20px;
  border-radius: 4px;
  color: white;

  h2 {
    color: #e8e8e8;
    font-size: 20px;
    line-height: 24px;
    margin-top: 0;
  }
`

const Container = styled.div`
  width: 350px;
  margin-bottom: 16px;
`

// TODO: rename component and file
export const AccountModalContent: React.FC<{
  close: () => void
}> = ({ close }) => {
  const { isSpellCheckEnabled, updateSetting } = useUserdata()
  const [isSpellCheckEnabledField, setIsSpellCheckEnabledField] = useState<
    boolean
  >(isSpellCheckEnabled)

  const onChangeIsSpellCheckEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.checked
    setIsSpellCheckEnabledField(inputValue)
    updateSetting("isSpellCheckEnabled", inputValue)
  }

  return (
    <ModalContainer>
      <h2>Settings</h2>
      <Container>
        {/* 
        TODO: support language choice and auto-detection, and maybe custom dictionaries 
        https://www.electronjs.org/docs/tutorial/spellchecker 
      */}
        <label htmlFor="isSpellCheckEnabledField">Spell Check&nbsp;</label>
        <input
          name="isSpellCheckEnabledField"
          type="checkbox"
          defaultChecked={isSpellCheckEnabledField}
          onChange={onChangeIsSpellCheckEnabled}
        />
      </Container>

      <h2>Account</h2>
      <LogoutButton onBeforeLogout={close} />
    </ModalContainer>
  )
}
