import { Descendant } from "slate"

export const serialize = (value: Descendant[]) => {
  return JSON.stringify(value)
}

export const deserialize = (value: string): Descendant[] => {
  try {
    return JSON.parse(value) as Descendant[]
  } catch (err) {
    console.group("Couldn't deserialize JSON to slate value")
    console.log("VALUE:")
    console.log(value)
    console.log("ERROR:")
    console.log(err)
    console.groupEnd()
    throw new Error("Couldn't deserialize JSON to slate value")
  }
}
