import React, { useMemo } from "react"

import Modal from "./Modal"
import { useToggleable, ToggleableHooks } from "../../hooks"

export const useModal = (
  initialState: boolean,
  options: ToggleableHooks = {}
) => {
  const { open, close, isOpen, toggle } = useToggleable(initialState, options)

  const StatefulModal: React.FC<{}> = useMemo(() => {
    return (props) => {
      return isOpen ? <Modal onRequestClose={close} {...props} /> : null
    }
  }, [close, isOpen])

  return { open, close, toggle, isOpen, Modal: StatefulModal }
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
