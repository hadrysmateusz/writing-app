import { ReactNode } from "react"
import { StyledComponent } from "styled-components/macro"

import { ToggleableHooks } from "../../hooks"

export type ModalProps = { onRequestClose: (...args: any) => any }

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
  Modal: React.FC<ModalRenderProps<ReturnValue, ModalProps>>
}

export type ModalContextValue<ReturnValue, ModalProps, AdditionalValues> =
  ModalType<ReturnValue, ModalProps> & AdditionalValues

export type ModalContentProps<ReturnValue = void, ModalProps = {}> = {
  close: CloseModalFn<ReturnValue>
} & ModalProps

export interface ModalRenderProps<ReturnValue, ModalProps> {
  component?: React.ComponentType<ModalContentProps<ReturnValue, ModalProps>>
  children?: (props: ModalContentProps<ReturnValue, ModalProps>) => ReactNode
}

interface ModalCompoundComposition {
  Container: StyledComponent<"div", any, {}, never>
  Message: StyledComponent<"div", any, {}, never>
  SecondaryMessage: StyledComponent<"div", any, {}, never>
  ButtonsContainer: StyledComponent<"div", any, {}, never>
  useModal: <ReturnValue, ModalProps extends object>(
    initialState: boolean,
    defaultModalProps: ModalProps,
    options?: ToggleableHooks<ReturnValue>
  ) => UseModalReturn<ReturnValue, ModalProps>
}
export type ModalCompoundComponent = React.FC<ModalProps> &
  ModalCompoundComposition
