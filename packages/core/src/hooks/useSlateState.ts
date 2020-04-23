import { useState, useCallback } from "react"
import { serialize, deserialize } from "../components/Editor/serialization"
import { Node } from "slate"

export const defaultState = [{ type: "paragraph", children: [{ text: "" }] }]

export const loadFromLocalStorage = () => {
  return deserialize(localStorage.getItem("content") || defaultState)
}

export const saveToLocalStorage = (value) => {
  localStorage.setItem("content", serialize(value))
}

export const useSlateState = (): [Node[], (value: Node[]) => void] => {
  const [value, setValue] = useState<Node[]>(loadFromLocalStorage())
  const onChange = useCallback((value: Node[]) => {
    setValue(value)
    saveToLocalStorage(value)
  }, [])

  return [value, onChange]
}
