import { BaseEditor } from "slate"
import { ReactEditor } from "slate-react"

// TODO: create proper typings
type GenericElement = { type: string; children: (CustomText | CustomElement)[] }
type CustomElement = GenericElement
type CustomText = { text: string }
type CustomEditor = BaseEditor & ReactEditor & { type: string | undefined }

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
