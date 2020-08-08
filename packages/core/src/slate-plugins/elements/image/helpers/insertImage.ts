import { Editor, Transforms } from "slate"
import { IMAGE } from "../types"

export const insertImage = (editor: Editor, url: string | ArrayBuffer) => {
  const text = { text: "" }
  const image = { type: IMAGE, url, children: [text] }
  Transforms.insertNodes(editor, image)
}

// const ImageModalProvider: React.FC = ({ children }) => {
//   // const {open,close} = useToggleable(false)

//   const el = useMemo(() => document.createElement("div"), [])

//   // useEffect(() => {
//   //   modalRoot.appendChild
//   // }, [])

//   return (
//     <>
//       {ReactDOM.createPortal(modalContents, el)}
//       {children}
//     </>
//   )
// }
