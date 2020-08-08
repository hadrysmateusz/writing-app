// TODO: replace local storage with something more performant - e.g. a local preferences rxdb database
export const getDefaultSize = (key: string, fallback: number): number => {
  return parseInt(localStorage.getItem(key) || fallback.toString(), 10)
}
export const setDefaultSize = (key: string, size: number): void => {
  localStorage.setItem(key, size.toString())
}
