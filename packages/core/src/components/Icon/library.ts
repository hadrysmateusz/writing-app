// React-Icons
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaQuoteRight,
  FaImage,
  FaListOl,
  FaListUl,
  FaPlus,
  FaStar,
  FaRegStar,
  FaEllipsisV,
  FaInbox,
} from "react-icons/fa"
import {
  AiFillCloud,
  AiFillFolderOpen,
  AiFillFolder,
  AiOutlineFolder,
} from "react-icons/ai"
import { IoMdTrash } from "react-icons/io"
import {
  BsCaretRightFill,
  BsCaretDownFill,
  BsLayoutSidebar,
} from "react-icons/bs"

// First-Party icons
import { ReactComponent as Heading1 } from "../../assets/Heading1.svg"
import { ReactComponent as Heading2 } from "../../assets/Heading2.svg"

import {
  BLOCKQUOTE,
  CODE_BLOCK,
  HeadingType,
  LINK,
  BOLD,
  ITALIC,
  STRIKE,
  CODE_INLINE,
  IMAGE,
} from "../../slate-plugins"
import { ListType } from "../../slateTypes"

const iconLibrary = {
  /* For icons representing blocks, marks and other slate node types the icon 
  names use the type names of those nodes for simplicity */
  [BOLD]: FaBold,
  [ITALIC]: FaItalic,
  [STRIKE]: FaStrikethrough,
  [CODE_INLINE]: FaCode,
  [LINK]: FaLink,
  [CODE_BLOCK]: FaCode,
  [BLOCKQUOTE]: FaQuoteRight,
  [IMAGE]: FaImage,
  [ListType.OL_LIST]: FaListOl,
  [ListType.UL_LIST]: FaListUl,
  [HeadingType.H1]: Heading1,
  [HeadingType.H2]: Heading2,
  plus: FaPlus,
  cloud: AiFillCloud,
  caretRight: BsCaretRightFill,
  caretDown: BsCaretDownFill,
  starFilled: FaStar,
  starOutline: FaRegStar,
  sidebarLeft: BsLayoutSidebar,
  trash: IoMdTrash,
  folderOpen: AiFillFolderOpen,
  folderClosed: AiFillFolder,
  folderEmpty: AiOutlineFolder,
  ellipsisVertical: FaEllipsisV,
  inbox: FaInbox,
}

export default iconLibrary
