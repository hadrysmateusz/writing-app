import { FunctionComponent, ReactNode } from "react"
// import { Toggleable } from "../../hooks"

export type OpenModalFn<T, ModalProps> = (
  props: ModalProps
) => Promise<T | undefined>

export type CloseModalFn<T> = (resolveValue: T) => void

export type Modal<T, ModalProps> = {
  isOpen: boolean
  open: OpenModalFn<T, ModalProps>
  close: CloseModalFn<T>
}

export type UseModalReturn<
  T,
  ModalProps
> /* Omit<Toggleable<T>, "open"> & */ = Modal<T, ModalProps> & {
  Modal: FunctionComponent<ModalRenderProps<T, ModalProps>>
}

export interface ModalRenderProps<T, ModalProps> {
  children: (props: { close: CloseModalFn<T> } & ModalProps) => ReactNode
}
