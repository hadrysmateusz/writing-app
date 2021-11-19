export type SortingDirection = "asc" | "desc"

export type SortingIndex = "modifiedAt" | "titleSlug"

export type Sorting = {
  index: SortingIndex
  direction: SortingDirection
}

export type ConfirmDeleteModalProps =
  | {
      all: false
      documentId: string | null
    }
  | {
      all: true
      documentId: undefined
    }

/**
 * The generic type has to be an RxDB Document
 *
 * Generics:
 * - D RxDB Document
 * - T RxDB DocType
 */
export type UpdateQueryConstructor<D, T> = (original: D) => Partial<T>

/**
 * Can be either:
 * - A set of values to be changed
 * - A function that takes the original document as a parameter and returnes an object with new values
 *
 * Generics:
 * - D RxDB Document
 * - T RxDB DocType
 */
export type Updater<D, T> = UpdateQueryConstructor<D, T> | Partial<T>
