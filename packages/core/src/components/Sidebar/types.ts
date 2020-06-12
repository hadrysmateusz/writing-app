// TODO: consider replacing with an enum
export const VIEWS = {
  ALL: "__ALL_DOCUMENTS",
}

export type ChangeViewFn = React.Dispatch<React.SetStateAction<string>>
