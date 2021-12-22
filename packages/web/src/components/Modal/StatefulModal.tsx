import { useMemo, useCallback, useState, FunctionComponent } from "react"

import { useToggleable, ToggleableHooks } from "../../hooks"

import { Modal } from "./Modal"
import {
  UseModalReturn,
  OpenModalFn,
  ModalRenderProps,
  CloseModalFn,
} from "./types"

// TODO: Consider making modals and context menus centralized with the root component not having to be added to the tree manually from the hook and only using some kind of hook to manage its state

export function useModal<ReturnValue, ModalProps extends object>(
  initialState: boolean,
  defaultModalProps: ModalProps,
  options: ToggleableHooks<ReturnValue> = {}
): UseModalReturn<ReturnValue, ModalProps> {
  const { close, open, isOpen } = useToggleable<ReturnValue>(
    initialState,
    options
  )
  const [modalProps, setModalProps] = useState<ModalProps>(defaultModalProps)

  const openModal = useCallback<OpenModalFn<ReturnValue, ModalProps>>(
    async (props) => {
      setModalProps(props)
      return open()
    },
    [open]
  )

  const closeModal = useCallback<CloseModalFn<ReturnValue>>(
    (resolveValue: ReturnValue) => {
      close(resolveValue)
      setModalProps(defaultModalProps)
    },
    [close, defaultModalProps]
  )

  const StatefulModal: FunctionComponent<
    ModalRenderProps<ReturnValue, ModalProps>
  > = useMemo(() => {
    return ({ component: C, children, ...props }) => {
      return isOpen ? (
        <Modal onRequestClose={closeModal} {...props}>
          {C ? (
            <C {...{ close: closeModal, ...modalProps }} />
          ) : children ? (
            children({ close: closeModal, ...modalProps })
          ) : null}
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
