export interface Toggleable<T = void> {
  isOpen: boolean
  open: () => Promise<T | undefined> | void // TODO: the void here is just a temporary patch
  close: (resolveValue?: T) => void
  toggle: () => void
}

export interface SimplifiedToggleableHooks {
  onBeforeChange?: (newState: boolean) => void
  onAfterChange?: (newState: boolean) => void
}

export interface ToggleableHooks<T = undefined>
  extends SimplifiedToggleableHooks {
  onBeforeOpen?: () => void
  onAfterOpen?: () => void
  onBeforeClose?: () => void
  // onAfterClose?: T extends undefined ? () => void : (resolveValue: T) => void
  onAfterClose?: (resolveValue?: T) => void
}
