import React, {
  useMemo,
  useCallback,
  useState,
  FunctionComponent,
  // useContext,
} from "react"

import Modal from "./Modal"
import { useToggleable, ToggleableHooks, Toggleable } from "../../hooks"
import createContext from "../../utils/createContext"

// TODO: Consider adding a context provider to the returned modal, which passes all of the toggleable props to the modal contents, and things passed into the open function
// TODO: Consider making modals and context menus centralized with the root component not having to be added to the tree manually from the hook and only using some kind of hook to manage its state

interface ModalContext {
  close: Toggleable["close"]
  [key: string]: any
}

const [useModalContext, _, ModalContext] = createContext<ModalContext>()

// TODO: create a custom useModalContext hook to allow providing the ModalProps type
// const ModalContext = React.createContext<ModalContext | undefined>(undefined)

// function useModalContext<ModalProps>() {
//   const c = useContext(ModalContext)
//   if (!c)
//     throw new Error(
//       "This context can't be accessed outside a Provider with a value"
//     )
//   return c
// }

type OpenModalFn<ModalProps> = (props?: ModalProps) => void

type UseModalReturn<ModalProps> = Omit<Toggleable, "open"> & {
  open: OpenModalFn<ModalProps>
  Modal: FunctionComponent
}

// TODO: using render props and passing might make exposing proper types to the modal content easier and more reliable

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

  const StatefulModal: FunctionComponent = useMemo(
    () => (props) => {
      return isOpen ? (
        <ModalContext.Provider value={{ close, props: modalProps }}>
          <Modal onRequestClose={close} {...props} />
        </ModalContext.Provider>
      ) : null
    },
    [close, isOpen, modalProps]
  )

  return {
    close: closeModal,
    open: openModal,
    toggle: toggleModal,
    isOpen,
    Modal: StatefulModal,
  }
}

export { useModalContext }

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
