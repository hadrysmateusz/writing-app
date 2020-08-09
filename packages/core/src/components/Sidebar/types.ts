// TODO: consider replacing with an enum
export const VIEWS = {
  ALL: "__ALL_DOCUMENTS__",
  TRASH: "__TRASH__",
  INBOX: "__INBOX__",
}

export const SECONDARY_VIEWS = {
  SNIPPETS: "__SNIPPETS__",
}

export type ChangeViewFn = React.Dispatch<React.SetStateAction<string>>
