import { Node } from "slate"

import { serialize, deserialize } from "../components/Editor/serialization"

export const defaultState = [{ type: "paragraph", children: [{ text: "" }] }]

export const loadFromLocalStorage = () => {
  const serializedContent = localStorage.getItem("content")
  return serializedContent ? deserialize(serializedContent) : defaultState
}

export const saveToLocalStorage = (value: Node[]) => {
  localStorage.setItem("content", serialize(value))
}
