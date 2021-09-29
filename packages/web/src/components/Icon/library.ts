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
  // FaStar,
  FaRegStar,
  FaEllipsisV,
  FaInbox,
  FaUser,
  FaSpinner,
  FaChevronDown,
  FaClipboard,
} from "react-icons/fa"
import {
  AiFillCloud,
  AiFillFolderOpen,
  AiFillFolder,
  AiOutlineFolder,
  // AiOutlineDownload,
} from "react-icons/ai"
import { IoMdTrash, IoMdSettings } from "react-icons/io"
import {
  BsCaretRightFill,
  BsCaretDownFill,
  BsLayoutSidebar,
  BsLayoutSidebarReverse,
} from "react-icons/bs"
import { BiStats } from "react-icons/bi"

import { CgMoreAlt } from "react-icons/cg"

import { FiDownload, FiPlus } from "react-icons/fi"

import { MdStar } from "react-icons/md"

import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LINK,
  ELEMENT_IMAGE,
} from "@udecode/plate"

// First-Party icons
import { ReactComponent as Heading1 } from "../../assets/Heading1.svg"
import { ReactComponent as Heading2 } from "../../assets/Heading2.svg"

const iconLibrary = {
  /* For icons representing blocks, marks and other slate node types the icon 
  names use the type names of those nodes for simplicity */
  [MARK_BOLD]: FaBold,
  [MARK_ITALIC]: FaItalic,
  [MARK_STRIKETHROUGH]: FaStrikethrough,
  [MARK_CODE]: FaCode,
  [ELEMENT_CODE_BLOCK]: FaCode,
  [ELEMENT_BLOCKQUOTE]: FaQuoteRight,
  [ELEMENT_OL]: FaListOl,
  [ELEMENT_UL]: FaListUl,
  [ELEMENT_H1]: Heading1,
  [ELEMENT_H2]: Heading2,
  [ELEMENT_LINK]: FaLink,
  [ELEMENT_IMAGE]: FaImage,
  stats: BiStats,
  plus: FiPlus,
  cloud: AiFillCloud,
  caretRight: BsCaretRightFill,
  caretDown: BsCaretDownFill,
  chevronDown: FaChevronDown,
  starFilled: MdStar,
  starOutline: FaRegStar,
  sidebarLeft: BsLayoutSidebar,
  sidebarRight: BsLayoutSidebarReverse,
  trash: IoMdTrash,
  folderOpen: AiFillFolderOpen,
  folderClosed: AiFillFolder,
  folderEmpty: AiOutlineFolder,
  ellipsisVertical: FaEllipsisV,
  ellipsisHorizontal: CgMoreAlt,
  inbox: FaInbox,
  user: FaUser,
  spinner: FaSpinner,
  settings: IoMdSettings,
  import: FiDownload,
  clipboard: FaClipboard,
}

export default iconLibrary
