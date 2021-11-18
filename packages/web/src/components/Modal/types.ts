import { FunctionComponent, ReactNode } from "react"

export type OpenModalFn<ReturnValue, ModalProps> = (
  props: ModalProps
) => Promise<ReturnValue | undefined>

export type CloseModalFn<T> = (resolveValue: T) => void

export type ModalType<ReturnValue, ModalProps> = {
  isOpen: boolean
  open: OpenModalFn<ReturnValue, ModalProps>
  close: CloseModalFn<ReturnValue>
}

export type UseModalReturn<ReturnValue, ModalProps> = ModalType<
  ReturnValue,
  ModalProps
> & {
  Modal: FunctionComponent<ModalRenderProps<ReturnValue, ModalProps>>
}

export type ModalContextValue<
  ReturnValue,
  ModalProps,
  AdditionalValues
> = ModalType<ReturnValue, ModalProps> & AdditionalValues

export type ModalContentProps<ReturnValue, ModalProps> = {
  close: CloseModalFn<ReturnValue>
} & ModalProps

export interface ModalRenderProps<ReturnValue, ModalProps> {
  component?: React.ComponentType<ModalContentProps<ReturnValue, ModalProps>>
  children?: (props: ModalContentProps<ReturnValue, ModalProps>) => ReactNode
}
