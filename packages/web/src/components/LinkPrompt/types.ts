import { CloseModalFn, Modal } from "../Modal/types"

export type LinkModalProps = { prevUrl: string | null }
export type LinkModalOpenReturnValue = string

export type LinkModalContextValue = Modal<
  LinkModalOpenReturnValue,
  LinkModalProps
> & {
  upsertLinkFromModal: () => Promise<void>
  getLinkUrl: (prevUrl: string | null) => Promise<string | null>
}

export type LinkModalContentProps = LinkModalProps & {
  close: CloseModalFn<LinkModalOpenReturnValue>
}
