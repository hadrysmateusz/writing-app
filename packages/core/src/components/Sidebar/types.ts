// TODO: consider replacing with an enum
export const VIEWS = {
  MAIN: "__MAIN__",
  ALL: "__ALL_DOCUMENTS",
}

export type ChangeViewFn = React.Dispatch<React.SetStateAction<string>>
