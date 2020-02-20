/**
 * Blocks can contain inlines or blocks. (With the exception of void elements)
 */

export const BLOCKS = {
	TEXT: "unstyled",
	// Classic blocks
	PARAGRAPH: "paragraph",
	BLOCKQUOTE: "blockquote",
	CODE: "code_block",
	COMMENT: "comment",
	// Voids
	IMAGE: "image",
	EMBED: "embed",
	HR: "hr",
	// Headings
	HEADING_1: "header_one",
	HEADING_2: "header_two",
	HEADING_3: "header_three",
	HEADING_4: "header_four",
	HEADING_5: "header_five",
	HEADING_6: "header_six",
	// Lists
	OL_LIST: "ordered_list",
	UL_LIST: "unordered_list",
	LIST_ITEM: "list_item"
}
