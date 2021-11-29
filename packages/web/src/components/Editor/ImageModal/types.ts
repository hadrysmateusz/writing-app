import { ModalContextValue, ModalContentProps } from "../../Modal/types"
import { PromptModalOpenReturnValue, PromptModalProps } from "../../PromptModal"

export type ImageModalOpenReturnValue = PromptModalOpenReturnValue
export type ImageModalProps = PromptModalProps
export type ImageModalContextValue = ModalContextValue<
  ImageModalOpenReturnValue,
  ImageModalProps,
  {
    insertImageFromModal: () => Promise<void>
    getImageUrl: () => Promise<string | null>
  }
>
export type ImageModalContentProps = ModalContentProps<
  ImageModalOpenReturnValue,
  ImageModalProps
>
