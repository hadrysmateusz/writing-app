import React from "react"

/**
 * This functions is a replacement for react's default createContext
 * It creates a context provider and useContext hook that guarantees
 * that the value is not undefined to help with typescript's type-checking
 */

// TODO: remove the provider, it only complicates creating the component that will actually manage the state and logic for this context and it can be easily retrieved from the Context itself

type ContextHook<ContextType> = () => ContextType

type ContextProvider<ContextType> = React.Provider<ContextType | undefined>

export function createContext<ContextType>(): Readonly<
  [
    ContextHook<ContextType>,
    ContextProvider<ContextType>,
    React.Context<ContextType | undefined>
  ]
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
  return [useContext, ctx.Provider, ctx] as const
}

export default createContext
