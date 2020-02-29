/**
 * Blocks can contain inlines or blocks. (With the exception of void elements)
 */

const BLOCKS = {
	TEXT: "unstyled",
	// Classic blocks
	PARAGRAPH: "paragraph",
	BLOCKQUOTE: "blockquote",
	CODE_BLOCK: "code_block",
	COMMENT: "comment",
	// Voids
	IMAGE: "image",
	EMBED: "embed",
	HR: "hr",
	// Headings
	HEADING_1: "heading_1",
	HEADING_2: "heading_2",
	HEADING_3: "heading_3",
	HEADING_4: "heading_4",
	HEADING_5: "heading_5",
	HEADING_6: "heading_6",
	// Lists
	LIST_NUMBERED: "list_numbered",
	LIST_BULLETED: "list_bulleted",
	LIST_ITEM: "list_item"
}

export default BLOCKS
