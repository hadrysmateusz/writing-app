import "is-hotkey"
import { KeyboardEvent } from "react"

declare module "is-hotkey" {
  function isHotkey(
    hotkey: string | ReadonlyArray<string>,
    options?: HotKeyOptions | KeyboardEvent | KeyboardEvent<Element>,
    event?: KeyboardEvent | KeyboardEvent<Element>
  ): boolean

  function isKeyHotkey(
    hotkey: string | ReadonlyArray<string>
  ): (event: KeyboardEvent<Element>) => boolean

  function isKeyHotkey(
    hotkey: string | ReadonlyArray<string>,
    event: KeyboardEvent<Element>
  ): boolean
}
