import { ModalContextValue, ModalContentProps } from "../Modal/types"
import { PromptModalOpenReturnValue, PromptModalProps } from "../PromptModal"

export type LinkModalOpenReturnValue = PromptModalOpenReturnValue
export type LinkModalProps = PromptModalProps
export type LinkModalContextValue = ModalContextValue<
  LinkModalOpenReturnValue,
  LinkModalProps,
  {
    upsertLinkFromModal: () => Promise<void>
    getLinkUrl: (prevUrl: string) => Promise<string | null>
  }
>
export type LinkModalContentProps = ModalContentProps<
  LinkModalOpenReturnValue,
  LinkModalProps
>
