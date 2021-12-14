import { useCallback } from "react"
import { Portal } from "react-portal"

import { useBodyScrollLock } from "../../hooks"

import { ModalBackdrop, ModalBox } from "./Modal.styles"

// TODO: move to a global provider based approach where there is one modal provider handling the modal's state and the consumers use a hook that registers a particular modal with an id in useEffect (this way we can check and prevent duplicate ids) this would eliminate the need for using a Modal component passed from a hook and instead only use a single hook that also exposes a getModalProps() function for the modal content component (maybe a single, globally exposed modal component could be used which would handle some of the interaction with the provider and the portal component)

// TODO: the modal almost definitely needs work: accessibility, focus trapping, options, different ways of closing it, etc.
export const Modal: React.FC<{ onRequestClose: (...args: any) => any }> = ({
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
