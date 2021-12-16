import { useState } from "react"

import { LogoutButton } from "../Auth"
import {
  ModalContainer,
  ModalContentProps,
  ModalMessageContainer,
} from "../Modal"
import { useUserdata } from "../Userdata"

import { InnerContainer } from "./SettingsModal.styles"

type SettingsModalContentProps = ModalContentProps

// TODO: rename component and file
export const SettingsModalContent: React.FC<SettingsModalContentProps> = ({
  close,
}) => {
  const { isSpellCheckEnabled, updateSetting } = useUserdata()
  const [isSpellCheckEnabledField, setIsSpellCheckEnabledField] =
    useState<boolean>(isSpellCheckEnabled)

  const onChangeIsSpellCheckEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.checked
    setIsSpellCheckEnabledField(inputValue)
    updateSetting("isSpellCheckEnabled", inputValue)
  }

  return (
    <ModalContainer>
      <ModalMessageContainer>Settings</ModalMessageContainer>
      <InnerContainer>
        {/* 
        TODO: support language choice and auto-detection, and maybe custom dictionaries 
        https://www.electronjs.org/docs/tutorial/spellchecker 
      */}
        <label>
          Spell Check&nbsp;&nbsp;
          <input
            name="isSpellCheckEnabledField"
            type="checkbox"
            defaultChecked={isSpellCheckEnabledField}
            onChange={onChangeIsSpellCheckEnabled}
          />
        </label>
      </InnerContainer>

      <ModalMessageContainer>Account</ModalMessageContainer>

      <LogoutButton onBeforeLogout={close} />
    </ModalContainer>
  )
}
