// import escapeHtml from "escape-html"
// import { Node, Element, Editor } from "slate"

// import {
//   MARK_BOLD,
//   MARK_ITALIC,
//   MARK_STRIKE,
//   MARK_CODE_INLINE,
//   ELEMENT_PARAGRAPH,
//   ELEMENT_BLOCKQUOTE,
//   ELEMENT_CODE_BLOCK,
//   ELEMENT_HEADING_1,
//   ELEMENT_HEADING_2,
//   ELEMENT_HEADING_3,
//   ELEMENT_HEADING_4,
//   ELEMENT_HEADING_5,
//   ELEMENT_HEADING_6,
//   ELEMENT_OL_LIST,
//   ELEMENT_UL_LIST,
//   ELEMENT_LIST_ITEM,
//   ELEMENT_HORIZONTAL_RULE,
//   ELEMENT_IMAGE,
//   ELEMENT_LINK,
// } from "../../slateTypes"

// const serializeElement = (
//   element: Node,
//   children: string
// ): string => {
//   switch (element.type as string | undefined) {
//     case ELEMENT_PARAGRAPH:
//       return `<p>${children}</p>`
//     case ELEMENT_BLOCKQUOTE:
//       return `<blockquote>${children}</blockquote>`
//     case ELEMENT_CODE_BLOCK:
//       return `<pre><code>${children}</code></pre>`

//     // TODO: additional heading options for medium publishing
//     case ELEMENT_HEADING_1:
//       return `<h1>${children}</h1>`
//     case ELEMENT_HEADING_2:
//       return `<h2>${children}</h2>`
//     case ELEMENT_HEADING_3:
//       return `<h3>${children}</h3>`
//     case ELEMENT_HEADING_4:
//       return `<h4>${children}</h4>`
//     case ELEMENT_HEADING_5:
//       return `<h5>${children}</h5>`
//     case ELEMENT_HEADING_6:
//       return `<h6>${children}</h6>`

//     // TODO: consider supporting tight lists (as defined in the commonmark markdown spec)
//     case ELEMENT_OL_LIST:
//       return `<ol>${children}</ol>`
//     case ELEMENT_UL_LIST:
//       return `<ul>${children}</ul>`
//     case ELEMENT_LIST_ITEM:
//       return `<li>${children}</li>`

//     case ELEMENT_LINK:
//       // TODO: better handle missing and invalid urls
//       const href =
//         typeof element.url === "string" ? escapeHtml(element.url) : ""
//       return `<a href="${escapeHtml(href)}">${children}</a>`

//     case ELEMENT_IMAGE:
//       const src = typeof element.url === "string" ? escapeHtml(element.url) : ""
//       // TODO: consider if and which wrapping tag should be used
//       // TODO: better handle missing and invalid urls
//       // TODO: alt text
//       // TODO: consider supporting the width/height attributes
//       // TODO: consider supporting other img attributes
//       // TODO: consider supporting images with captions (especially for medium publishing) using the figure and figcaption tags
//       return `<div><img src="${src}"/></div>`
//     case ELEMENT_HORIZONTAL_RULE:
//       return `<hr />`

//     default:
//       throw new Error(
//         `HTML Serializer encountered unknown type: ${element.type}`
//       )
//   }
// }

// const serializeLeaf = (leaf: Node, children: string): string => {
//   children = escapeHtml(children)

//   if (leaf[MARK_BOLD]) {
//     // TODO: decide between strong and b (or provide option)
//     children = `<strong>${children}</strong>`
//   }
//   if (leaf[MARK_ITALIC]) {
//     // TODO: decide between em and i (or provide option)
//     children = `<em>${children}</em>`
//   }
//   if (leaf[MARK_STRIKE]) {
//     children = `<s>${children}</s>`
//   }
//   if (leaf[MARK_CODE_INLINE]) {
//     children = `<code>${children}</code>`
//   }

//   return children
// }

// export const serializeHTML = (node: Node): string => {
//   // TODO: strip the last paragraph if empty
//   // TODO: consider adding the title as an h1 at the top (at least optionally)
//   // TODO: consider an option to generate more complete html (entire page with head etc.)

//   if (Editor.isEditor(node)) {
//     return (node.children || []).map(serializeHTML).join("")
//   }

//   if (Element.isElement(node)) {
//     const children = (node.children || []).map(serializeHTML).join("")
//     return serializeElement(node, children)
//   } else {
//     return serializeLeaf(node, node.text)
//   }
// }

export const serializeHTML = () => {}
