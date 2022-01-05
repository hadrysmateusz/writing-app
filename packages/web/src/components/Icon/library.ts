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
  FaChevronUp,
  FaClipboard,
  FaPen,
} from "react-icons/fa"
import {
  AiFillCloud,
  AiFillFolderOpen,
  AiFillFolder,
  AiOutlineFolder,
  AiFillTag,
  AiFillTags,
  // AiOutlineDownload,
} from "react-icons/ai"
import { IoMdTrash, IoMdSettings } from "react-icons/io"
import {
  BsCaretRightFill,
  BsCaretDownFill,
  BsLayoutSidebar,
  BsLayoutSidebarReverse,
  BsArrow90DegUp,
} from "react-icons/bs"
import { BiStats, BiSort, BiSearch } from "react-icons/bi"

import { CgMoreAlt } from "react-icons/cg"

import { FiDownload, FiPlus } from "react-icons/fi"

import { MdStar, MdClose } from "react-icons/md"

import { RiSideBarFill } from "react-icons/ri"

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

// TODO: make the Icon component use the keys of this object as the type for the icon prop
export const iconLibrary = {
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
  arrow90DegUp: BsArrow90DegUp,
  clipboard: FaClipboard,
  close: MdClose,
  cloud: AiFillCloud,
  caretRight: BsCaretRightFill,
  caretDown: BsCaretDownFill,
  chevronDown: FaChevronDown,
  chevronUp: FaChevronUp,
  ellipsisVertical: FaEllipsisV,
  ellipsisHorizontal: CgMoreAlt,
  folderOpen: AiFillFolderOpen,
  folderClosed: AiFillFolder,
  folderEmpty: AiOutlineFolder,
  import: FiDownload,
  inbox: FaInbox,
  pen: FaPen,
  plus: FiPlus,
  sidebarLeft: BsLayoutSidebar,
  sidebarRight: BsLayoutSidebarReverse,
  sidebarNavigator: RiSideBarFill,
  sort: BiSort,
  starFilled: MdStar,
  starOutline: FaRegStar,
  spinner: FaSpinner,
  settings: IoMdSettings,
  stats: BiStats,
  search: BiSearch,
  tag: AiFillTag,
  tags: AiFillTags,
  trash: IoMdTrash,
  user: FaUser,
}

export type IconNames = keyof typeof iconLibrary

export default iconLibrary
