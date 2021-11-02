import { CloseModalFn, Modal } from "../Modal/types"

export type ImageModalProps = {}
export type ImageModalOpenReturnValue = string

export type ImageModalContextValue = Modal<
  ImageModalOpenReturnValue,
  ImageModalProps
> & {
  insertImageFromModal: () => Promise<void>
  getImageUrl: () => Promise<string | null>
}

export type ImageModalContentProps = ImageModalProps & {
  close: CloseModalFn<ImageModalOpenReturnValue>
}
