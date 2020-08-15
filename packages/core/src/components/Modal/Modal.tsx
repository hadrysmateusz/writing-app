import React, { useCallback } from "react"
import { Portal } from "react-portal"
import styled from "styled-components/macro"

import { useBodyScrollLock } from "../../hooks"

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`

const ModalBox = styled.div`
  z-index: 1001;
  position: relative;
`

// TODO: the modal almost definitely needs work: accessibility, focus trapping, options, different ways of closing it, etc.
export const Modal: React.FC<{ onRequestClose: () => void }> = ({
  children,
  onRequestClose,
}) => {
  const { scrollableRef } = useBodyScrollLock(true)

  const handleKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // close on Escape
      // TODO: make this optional
      if (event.key === "Escape") {
        onRequestClose()
      }
    },
    [onRequestClose]
  )

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // prevent click events on the trigger from propagating to the rest of the React tree
      event.stopPropagation()
      // call the on request close handler
      if (event.target === event.currentTarget) {
        onRequestClose()
      }
    },
    [onRequestClose]
  )

  return (
    <Portal>
      <ModalBackdrop
        // The error is here because the useRef that creates scrollableRef doesn't have a default value
        // TODO: check if this is dangerous and how it can be fixed
        ref={scrollableRef}
        onKeyDown={handleKeydown}
        onClick={handleBackdropClick}
      >
        <ModalBox>{children}</ModalBox>
      </ModalBackdrop>
    </Portal>
  )
}

export default Modal
