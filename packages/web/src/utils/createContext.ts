import React from "react"

/**
 * This functions is a replacement for react's default createContext
 * It creates a context useContext hook that guarantees
 * that the value is not undefined to help with typescript's type-checking
 */

//  TODO: rename to createRequiredContext or something like that

type ContextHook<ContextType> = () => ContextType

export function createContext<ContextType>(): Readonly<
  [React.Context<ContextType | undefined>, ContextHook<ContextType>]
> {
  const ctx = React.createContext<ContextType | undefined>(undefined)
  function useContext() {
    const c = React.useContext(ctx)
    if (!c)
      throw new Error(
        "This context can't be accessed outside a Provider with a value"
      )
    return c
  }
  return [ctx, useContext] as const
}

export default createContext
