import React, { useMemo, useCallback, useState, FunctionComponent } from "react"

import Modal from "./Modal"
import { useToggleable, ToggleableHooks } from "../../hooks"
import {
  UseModalReturn,
  OpenModalFn,
  ModalRenderProps,
  CloseModalFn,
} from "./types"

// TODO: Consider making modals and context menus centralized with the root component not having to be added to the tree manually from the hook and only using some kind of hook to manage its state

export function useModal<T, ModalProps extends object>(
  initialState: boolean,
  defaultModalProps: ModalProps,
  options: ToggleableHooks = {}
): UseModalReturn<T, ModalProps> {
  const { close, open, isOpen } = useToggleable<T>(initialState, options)
  const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps)

  const openModal = useCallback<OpenModalFn<T, ModalProps>>(
    async (props) => {
      setModalProps(props)
      return open()
    },
    [open]
  )

  const closeModal = useCallback<CloseModalFn<T>>(
    (resolveValue?: T) => {
      close(resolveValue)
      setModalProps(defaultModalProps)
    },
    [close, defaultModalProps]
  )

  const StatefulModal: FunctionComponent<ModalRenderProps<
    T,
    ModalProps
  >> = useMemo(() => {
    return ({ children, ...props }) => {
      return isOpen ? (
        <Modal onRequestClose={closeModal} {...props}>
          {children({ close: closeModal, ...modalProps })}
        </Modal>
      ) : null
    }
  }, [closeModal, isOpen, modalProps])

  return {
    close: closeModal,
    open: openModal,
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
