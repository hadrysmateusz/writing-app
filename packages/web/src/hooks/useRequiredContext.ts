import { useContext, Context } from "react"

/**
 * An alternative to the default useContext hook that throws an error if the context value is null
 *
 * It's useful for using context with typescript
 */
export const useRequiredContext = <T>(
  context: Context<T | null>,
  errorMessage?: string
): T => {
  const contextValue = useContext(context)

  if (contextValue === null) {
    throw new Error(errorMessage || `Context: ${context.displayName} is null`)
  }

  return contextValue
}
