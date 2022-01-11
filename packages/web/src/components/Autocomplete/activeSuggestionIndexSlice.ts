export const DEFAULT_ACTIVE_SUGGESTION_INDEX: number = 0

export type ActiveSuggestionIndexAction =
  | {
      type: "select-next"
      suggestionsCount: number
    }
  | {
      type: "select-prev"
    }
  | {
      type: "reset"
    }
  | {
      type: "clamp"
      suggestionsCount: number
    }

export const activeSuggestionIndexReducer = (
  state: number,
  action: ActiveSuggestionIndexAction
) => {
  switch (action.type) {
    case "select-next": {
      return Math.min(action.suggestionsCount - 1, (state += 1))
    }
    case "select-prev": {
      return Math.max(0, (state -= 1))
    }
    case "reset": {
      return DEFAULT_ACTIVE_SUGGESTION_INDEX
    }
    case "clamp": {
      const isIndexOutOfBounds = state > action.suggestionsCount - 1
      return isIndexOutOfBounds ? 0 : state
    }
    default: {
      return state
    }
  }
}
