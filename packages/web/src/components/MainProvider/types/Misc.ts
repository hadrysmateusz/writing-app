import { Toggleable } from "../../../hooks"

export type Direction = "asc" | "desc"

export type SortingIndex = "modifiedAt" | "title"

export type Sorting = {
  index: SortingIndex
  direction: Direction
}

export type ConfirmDeleteModalProps = {
  close: Toggleable<undefined>["close"]
  documentId?: string
}

/**
 * The generic type has to be an RxDB Document
 */
export type UpdateQueryConstructor<D> = (original: D) => any

/**
 * Can be either:
 * - A set of values to be changed
 * - A function that takes the original document as a parameter and returnes an object with new values
 *
 * Generics:
 * - D RxDB Document
 * - T RxDB DocType
 */
export type Updater<D, T> = UpdateQueryConstructor<D> | Partial<T>
