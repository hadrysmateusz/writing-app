import React, { useMemo, useCallback, useState, FunctionComponent } from "react"

import Modal from "./Modal"
import { useToggleable, ToggleableHooks } from "../../hooks"
import { UseModalReturn, OpenModalFn, ModalRenderProps } from "./types"

// TODO: Consider making modals and context menus centralized with the root component not having to be added to the tree manually from the hook and only using some kind of hook to manage its state

export function useModal<ModalProps>(
  initialState: boolean,
  options: ToggleableHooks = {}
): UseModalReturn<ModalProps> {
  const { close, open, isOpen } = useToggleable(initialState, options)
  const [modalProps, setModalProps] = useState<ModalProps>()

  const openModal = useCallback<OpenModalFn<ModalProps>>(
    (props) => {
      setModalProps(props)
      open()
    },
    [open]
  )

  const closeModal = useCallback(() => {
    close()
    setModalProps(undefined)
  }, [close])

  const toggleModal = useCallback(
    (props?: ModalProps) => {
      if (isOpen) {
        closeModal()
      } else {
        openModal(props)
      }
    },
    [closeModal, isOpen, openModal]
  )

  const StatefulModal: FunctionComponent<ModalRenderProps<
    ModalProps
  >> = useMemo(() => {
    // TODO: figure out a way to guarantee that the ModalProps will be available in the render method
    return ({ render, children, ...props }) => {
      return isOpen ? (
        <Modal onRequestClose={close} {...props}>
          {render
            ? render(modalProps ? { close, ...modalProps } : { close })
            : children}
        </Modal>
      ) : null
    }
  }, [close, isOpen, modalProps])

  return {
    close: closeModal,
    open: openModal,
    toggle: toggleModal,
    isOpen,
    Modal: StatefulModal,
  }
}

// type ChildrenWrapper = (children: React.ReactNode) => JSX.Element | null

// type RenderProps = Toggleable & {
//   modal: ChildrenWrapper
// }

// export const StatefulModal: React.FC<{
//   children: (props: RenderProps) => JSX.Element
// }> = ({ children }) => {
//   const { open, close, isOpen, toggle } = useToggleable(false)

//   const wrapWithModal: ChildrenWrapper = useCallback(
//     (children) => {
//       if (isOpen) {
//         return <Modal onRequestClose={close}>{children}</Modal>
//       } else {
//         return null
//       }
//     },
//     [close, isOpen]
//   )

//   return children({ open, close, toggle, isOpen, modal: wrapWithModal })
// }
