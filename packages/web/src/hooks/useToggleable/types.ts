export interface Toggleable<T> {
  isOpen: boolean
  open: () => Promise<T | undefined> | void // TODO: the void here is just a temporary patch
  close: (resolveValue?: T) => void
  toggle: () => void
}

export interface SimplifiedToggleableHooks {
  onBeforeChange?: (newState: boolean) => void
  onAfterChange?: (newState: boolean) => void
}

export interface ToggleableHooks extends SimplifiedToggleableHooks {
  onBeforeOpen?: () => void
  onAfterOpen?: () => void
  onBeforeClose?: () => void
  onAfterClose?: () => void
}
