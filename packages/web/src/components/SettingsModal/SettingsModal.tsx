import { useState } from "react"

import { LogoutButton } from "../Auth"
import { ModalContainer, ModalContentProps } from "../Modal"
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
      <h2>Settings</h2>
      <InnerContainer>
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
      </InnerContainer>

      <h2>Account</h2>
      <LogoutButton onBeforeLogout={close} />
    </ModalContainer>
  )
}
