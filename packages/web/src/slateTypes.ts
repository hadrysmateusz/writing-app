export enum ListType {
  OL_LIST = "numbered_list",
  UL_LIST = "bulleted_list",
  LIST_ITEM = "list_item",
}

// TODO: consider making these types shorter to decrease document size in storage
// TODO: consider adding a utility to expand those shorter names for printing

// Block elements

export const ELEMENT_PARAGRAPH = "paragraph"
export const ELEMENT_BLOCKQUOTE = "blockquote"
export const ELEMENT_CODE_BLOCK = "code_block"

export const ELEMENT_HEADING_1 = "heading_1"
export const ELEMENT_HEADING_2 = "heading_2"
export const ELEMENT_HEADING_3 = "heading_3"
export const ELEMENT_HEADING_4 = "heading_4"
export const ELEMENT_HEADING_5 = "heading_5"
export const ELEMENT_HEADING_6 = "heading_6"

export const ELEMENT_OL_LIST = ListType.OL_LIST as string
export const ELEMENT_UL_LIST = ListType.UL_LIST as string
export const ELEMENT_LIST_ITEM = ListType.LIST_ITEM as string

export const ELEMENT_HORIZONTAL_RULE = "hr"
export const ELEMENT_IMAGE = "image"

// Inline elements

export const ELEMENT_LINK = "link"

// Marks

export const MARK_BOLD = "bold"
export const MARK_ITALIC = "italic"
export const MARK_STRIKE = "strike"
export const MARK_CODE_INLINE = "code_inline"
