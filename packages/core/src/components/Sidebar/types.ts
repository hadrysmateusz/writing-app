// TODO: consider replacing with an enum
export const VIEWS = {
  ALL: "__ALL_DOCUMENTS__",
  TRASH: "__TRASH__",
}

export type ChangeViewFn = React.Dispatch<React.SetStateAction<string>>
