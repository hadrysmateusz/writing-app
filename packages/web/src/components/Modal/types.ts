import { FunctionComponent, ReactNode } from "react"
import { Toggleable } from "../../hooks"

export type OpenModalFn<ModalProps> = (props?: ModalProps) => void

export type UseModalReturn<ModalProps> = Omit<Toggleable, "open"> & {
  open: OpenModalFn<ModalProps>
  Modal: FunctionComponent<ModalRenderProps<ModalProps>>
}

export interface ModalRenderProps<ModalProps> {
  render?: (
    props: ({ close: () => void } & ModalProps) | { close: () => void }
  ) => ReactNode
}
